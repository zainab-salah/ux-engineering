# Installation

## Recommended: Skills CLI

```sh
npx skills add zainab-salah/ux-engineering --skill ux-engineering
```

Choose the agent and project/personal scope when prompted. This installs from GitHub using the existing open-source Skills CLI; it does not require this project to have its own npm release.

## Manual project installation

From a clone of this repository:

```sh
mkdir -p /path/to/your-project/.agents/skills
test ! -e /path/to/your-project/.agents/skills/ux-engineering && cp -R skills/ux-engineering /path/to/your-project/.agents/skills/
```

For a personal installation, use the skill directory recognized by your agent (for example `~/.agents/skills` or Codex's configured skills directory). Existing installations should be reviewed before replacement. The portable entry point is `SKILL.md`; `agents/openai.yaml` adds Codex UI metadata.

## Direct npm package — prepared, not published

The repository contains a dependency-free package installer for the proposed name `@zainab-salah/ux-engineering`. Registry publication is pending npm authentication and confirmation of the account/scope. Do not treat an npm command for that name as available yet.

To test the installer from a clone, run `node bin/install.mjs` in the target project via its absolute path. It copies the skill to `.agents/skills/ux-engineering`, refuses to overwrite an existing destination and runs no installation hooks. `--global` selects `~/.agents/skills/ux-engineering`; `--dest /absolute/path/to/ux-engineering` selects an explicit skill folder. No other project files are changed.

After registry publication, the same installer can be run through `npx @zainab-salah/ux-engineering`. The package allowlist includes only the installer, skill, README, package metadata and license; private research, evaluation outputs and app examples are excluded.

## Development checks

Python 3.10+ and Node.js 18+:

```sh
python3 scripts/validate.py
python3 -m unittest discover -s tests -p 'test_*.py'
npm test
python3 scripts/score.py evals/results/grades.json
```

Reload your agent's skill discovery if necessary. A successful copy proves installation, not automatic activation or UX effectiveness.
