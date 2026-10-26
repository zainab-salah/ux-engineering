import copy
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from score import summarize
from validate import validate


class ToolsTests(unittest.TestCase):
    def setUp(self):
        self.grade = {'runs': [{'case_id': 1, 'condition': 'with_skill', 'status': 'complete', 'criteria': [
            {'id': 'id-code', 'passed': True, 'evidence': 'Output keeps opaque ID'},
            {'id': 'recovery', 'passed': False, 'evidence': 'Output loses the draft'}]}]}

    def test_package_is_portable(self):
        self.assertEqual(validate()['evaluation_scenarios'], 9)

    def test_aggregation_counts_failed_criteria(self):
        self.assertEqual(summarize(self.grade)['with_skill']['pass_rate'], .5)

    def test_incomplete_run_is_not_a_zero_or_a_pass(self):
        self.grade['runs'][0]['status'] = 'incomplete'
        self.assertEqual(summarize(self.grade), {})

    def test_rejects_unsupported_grade(self):
        for field, value in [('evidence', ''), ('passed', 'true')]:
            with self.subTest(field=field):
                altered = copy.deepcopy(self.grade)
                altered['runs'][0]['criteria'][0][field] = value
                with self.assertRaises(ValueError):
                    summarize(altered)

    def test_rejects_duplicate_run_and_criterion(self):
        duplicate = copy.deepcopy(self.grade)
        duplicate['runs'].append(copy.deepcopy(duplicate['runs'][0]))
        with self.assertRaises(ValueError):
            summarize(duplicate)
        self.grade['runs'][0]['criteria'][1]['id'] = 'id-code'
        with self.assertRaises(ValueError):
            summarize(self.grade)


if __name__ == '__main__':
    unittest.main()
