"""Local synthetic API and static showcase. All writes are memory-only."""
import copy
import json
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlsplit

ROOT = Path(__file__).resolve().parent
COUNTRIES = [{'code': code, 'label': label} for code, label in [
    ('TR', 'Türkiye'), ('DE', 'Germany'), ('GB', 'United Kingdom'),
    ('US', 'United States'), ('FR', 'France')]]
OWNERS = [{'id': f'usr-{i:03}', 'name': 'Alex Morgan' if i in (2, 34) else f'Operator {i:02}',
           'desk': ['Enterprise', 'Support', 'Europe', 'Growth'][i % 4]} for i in range(1, 42)]
INITIAL = [{'id': f'client-{i:03}', 'name': 'Zulu Search Target' if i == 137 else f'{["Acorn", "Beacon", "Cedar", "Delta", "Elm"][i % 5]} Client {i:03}',
            'email': f'client{i:03}@example.test', 'country': COUNTRIES[i % 5]['code'],
            'status': ['new', 'contacted', 'closed'][i % 3], 'owner_id': OWNERS[(i * 7) % 41]['id'],
            'created_at': f'2026-09-{1 + i % 28:02}T10:00:00Z'} for i in range(1, 138)]
DATA = {name: copy.deepcopy(INITIAL) for name in ['baseline', 'with-skill']}
LOCK = threading.Lock()


def enrich(client):
    return {**client, 'owner': next((o for o in OWNERS if o['id'] == client['owner_id']), None)}


def validate(values, create=False):
    errors = {}
    for key in values:
        if key not in ['name', 'country', 'status', 'owner_id']:
            errors[key] = ['Read-only or unknown field.']
    if create or 'name' in values:
        name = values.get('name')
        if not isinstance(name, str) or not name.strip() or len(name) > 120:
            errors['name'] = ['Enter a name of 1–120 characters.']
    if create or 'country' in values:
        if values.get('country') not in [c['code'] for c in COUNTRIES]:
            errors['country'] = ['Choose a supported country.']
    if create or 'status' in values:
        if values.get('status') not in ['new', 'contacted', 'closed']:
            errors['status'] = ['Choose a valid status.']
    if 'owner_id' in values and values['owner_id'] is not None:
        if values['owner_id'] not in [o['id'] for o in OWNERS]:
            errors['owner_id'] = ['Choose an eligible owner.']
    return errors


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def log_message(self, *args):
        pass

    def send_json(self, status, body):
        payload = json.dumps(body).encode()
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Content-Length', str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)

    def do_GET(self):
        parsed = urlsplit(self.path)
        if not parsed.path.startswith('/api/'):
            return super().do_GET()
        q = parse_qs(parsed.query)
        variant = q.get('variant', [''])[0]
        if variant not in DATA:
            return self.send_json(400, {'detail': 'Choose a valid variant.'})
        try:
            page = max(1, int(q.get('page', ['1'])[0]))
            size = int(q.get('page_size', ['10'])[0])
        except ValueError:
            return self.send_json(400, {'detail': 'Invalid pagination.'})
        search = q.get('search', [''])[0].casefold()
        if parsed.path == '/api/countries':
            return self.send_json(200, COUNTRIES)
        if parsed.path == '/api/owners':
            rows = [o for o in OWNERS if search in (o['name'] + ' ' + o['desk']).casefold()]
            return self.send_json(200, {'count': len(rows), 'results': rows[(page-1)*8:page*8]})
        if parsed.path.startswith('/api/owners/'):
            row = next((o for o in OWNERS if o['id'] == parsed.path.rsplit('/', 1)[-1]), None)
            return self.send_json(200 if row else 404, row or {'detail': 'Not found.'})
        with LOCK:
            rows = copy.deepcopy(DATA[variant])
        if parsed.path == '/api/clients':
            if size not in [10, 25]:
                return self.send_json(400, {'detail': 'Page size must be 10 or 25.'})
            rows = [r for r in rows if search in (r['name']+' '+r['email']).casefold()]
            for key in ['country', 'status']:
                if q.get(key): rows = [r for r in rows if r[key] == q[key][0]]
            rows.sort(key=lambda r: r['name'], reverse=q.get('ordering', ['name'])[0] == '-name')
            return self.send_json(200, {'count': len(rows), 'results': [enrich(r) for r in rows[(page-1)*size:page*size]]})
        if parsed.path.startswith('/api/clients/'):
            row = next((r for r in rows if r['id'] == parsed.path.rsplit('/', 1)[-1]), None)
            return self.send_json(200 if row else 404, enrich(row) if row else {'detail': 'Not found.'})
        self.send_json(404, {'detail': 'Not found.'})

    def mutate(self, create):
        parsed = urlsplit(self.path)
        variant = parse_qs(parsed.query).get('variant', [''])[0]
        if variant not in DATA or (create and parsed.path != '/api/clients') or (not create and not parsed.path.startswith('/api/clients/')):
            return self.send_json(400, {'detail': 'Invalid write target.'})
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 < length <= 16384: raise ValueError()
            values = json.loads(self.rfile.read(length))
            if not isinstance(values, dict): raise ValueError()
        except (ValueError, json.JSONDecodeError):
            return self.send_json(400, {'detail': 'Invalid JSON object.'})
        errors = validate(values, create)
        if errors: return self.send_json(400, errors)
        if 'fail' in values.get('name', '').casefold():
            return self.send_json(503, {'detail': 'Temporary service failure; retry with another name.'})
        with LOCK:
            if create:
                i = len(DATA[variant]) + 1
                row = {'id': f'client-{i:03}', 'email': f'client{i:03}@example.test', 'owner_id': None,
                       'created_at': '2026-10-26T12:00:00Z', **values}
                DATA[variant].append(row)
            else:
                row = next((r for r in DATA[variant] if r['id'] == parsed.path.rsplit('/', 1)[-1]), None)
                if row is None: return self.send_json(404, {'detail': 'Not found.'})
                row.update(values)
            result = enrich(row)
        self.send_json(201 if create else 200, result)

    def do_POST(self): self.mutate(True)
    def do_PATCH(self): self.mutate(False)


if __name__ == '__main__':
    print('ServiceDesk showcase: http://127.0.0.1:8765', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 8765), Handler).serve_forever()
