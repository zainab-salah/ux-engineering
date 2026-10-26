"""Contract checks for the synthetic demonstration, not browser UX tests."""
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'evals/showcase'))
from server import COUNTRIES, INITIAL, OWNERS, enrich, validate


class ShowcaseContractTests(unittest.TestCase):
    def test_representative_scale_and_off_page_target(self):
        self.assertEqual(len(INITIAL), 137)
        self.assertEqual(len(OWNERS), 41)
        self.assertEqual(INITIAL[-1]['name'], 'Zulu Search Target')
        self.assertNotIn('usr-041', [o['id'] for o in OWNERS[:8]])

    def test_valid_payload_and_clear(self):
        self.assertEqual(validate({'name': 'Sample', 'country': 'TR', 'status': 'new', 'owner_id': 'usr-041'}, True), {})
        self.assertEqual(validate({'owner_id': None}), {})

    def test_server_rejects_bad_data_and_read_only_keys(self):
        self.assertEqual(set(validate({'name': '', 'country': 'ZZ', 'status': 'invalid'}, True)), {'name', 'country', 'status'})
        self.assertIn('created_at', validate({'created_at': 'today'}))
        self.assertIn('owner_id', validate({'owner_id': 'unknown'}))

    def test_human_labels_do_not_replace_wire_values(self):
        row = enrich(INITIAL[0])
        self.assertEqual(row['owner']['id'], row['owner_id'])
        self.assertIn(row['country'], [c['code'] for c in COUNTRIES])
        self.assertNotEqual(row['owner']['name'], row['owner_id'])


if __name__ == '__main__':
    unittest.main()
