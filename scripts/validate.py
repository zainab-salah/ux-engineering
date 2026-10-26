"""Dependency-free package checks; not a UX or full YAML-spec validator."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def validate(root=ROOT):
    skill = root / 'skills/ux-engineering'
    text = (skill / 'SKILL.md').read_text()
    front = re.match(r'\A---\nname: ([a-z0-9-]+)\ndescription: ([^\n]+)\nlicense: MIT\n---\n', text)
    if not front or front[1] != skill.name or not 1 <= len(front[2]) <= 1024:
        raise ValueError('Invalid package frontmatter')
    for path in skill.rglob('*.md'):
        for target in re.findall(r'\]\(([^)]+)\)', path.read_text()):
            if '://' in target or target.startswith('#'):
                continue
            resolved = (path.parent / target.split('#')[0]).resolve()
            if not resolved.is_relative_to(skill.resolve()) or not resolved.is_file():
                raise ValueError(f'Unportable reference: {path.name}: {target}')
    suite = json.loads((root / 'evals/evals.json').read_text())
    ids = [case['id'] for case in suite['evals']]
    if len(ids) != len(set(ids)):
        raise ValueError('Duplicate evaluation IDs')
    for case in suite['evals']:
        if not case['prompt'].strip():
            raise ValueError('Empty evaluation prompt')
        for name in case['files']:
            path = (root / 'evals' / name).resolve()
            if not path.is_relative_to((root / 'evals/fixtures').resolve()) or not path.is_file():
                raise ValueError(f'Missing or invalid fixture: {name}')
    return {'skill_lines': len(text.splitlines()), 'evaluation_scenarios': len(ids)}


if __name__ == '__main__':
    print(json.dumps(validate(), indent=2))
