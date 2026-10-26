// Synthetic review fixture. Deliberately incomplete; not an application to run.
// API: GET /clients/?search=&page= returns {count,next,results}; search covers all records.
// PATCH /clients/:id/ accepts writable dirty fields only. `canEditOwner` is independent
// of `canEditName`. owner_id is opaque and resolves through scoped /owners/?search=.
// GET/POST/DELETE /mapping-presets/ already support finding, applying and deleting presets.
export function ClientWorkspace({ page, canEditOwner, canEditName, api }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const [draft, setDraft] = useState({ name: "", owner_id: "" });
  const [error, setError] = useState("");
  const rows = page.results.filter(row => row.name.includes(search));
  async function save() {
    try { await api.patchClient(draft); }
    catch { setError("Request failed"); setDraft({ name: "", owner_id: "" }); }
  }
  return <main>
    <h1>Clients</h1>
    <input placeholder="Search all clients" value={search} onChange={e => setSearch(e.target.value)} />
    <button onClick={() => setSelected(rows.map(r => r.id))}>Select all {page.count} clients</button>
    <table><tbody>{rows.map(row => <tr key={row.id}>
      <td>{row.name}</td><td>{row.owner_id}</td>
    </tr>)}</tbody></table>
    <section>
      <h2>Edit client</h2>
      {(canEditName || canEditOwner) && <>
        <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} />
        <input placeholder="Owner ID" value={draft.owner_id} onChange={e => setDraft({ ...draft, owner_id: e.target.value })} />
        <button onClick={save}>Save</button>
      </>}
      {error && <div role="alert">{error}</div>}
    </section>
    <button onClick={() => api.createPreset(draft)}>Save mapping preset</button>
  </main>;
}
