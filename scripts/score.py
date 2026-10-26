"""Aggregate evidence-backed human/agent judgments; never infer grades from keywords."""
import argparse
import json
from pathlib import Path


def summarize(document):
    totals = {}
    seen = set()
    for run in document['runs']:
        key = (run['case_id'], run['condition'])
        if key in seen or run['condition'] not in ('with_skill', 'without_skill'):
            raise ValueError('Duplicate run or invalid condition')
        seen.add(key)
        if run['status'] != 'complete':
            continue
        if not run['criteria']:
            raise ValueError('Completed grade needs criteria')
        group = totals.setdefault(run['condition'], {'passed': 0, 'total': 0, 'runs': 0})
        group['runs'] += 1
        criteria = set()
        for criterion in run['criteria']:
            if criterion['id'] in criteria or type(criterion['passed']) is not bool or not criterion['evidence'].strip():
                raise ValueError('Grades need unique criteria, boolean verdict and evidence')
            criteria.add(criterion['id'])
            group['total'] += 1
            group['passed'] += criterion['passed']
    for group in totals.values():
        group['pass_rate'] = group['passed'] / group['total']
    return totals


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('grades', type=Path)
    args = parser.parse_args()
    print(json.dumps(summarize(json.loads(args.grades.read_text())), indent=2))
