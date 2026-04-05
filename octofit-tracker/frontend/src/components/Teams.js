import React, { useEffect, useState } from 'react';

function getApiBase() {
  const cs = process.env.REACT_APP_CODESPACE_NAME;
  if (cs) return `https://${cs}-8000.app.github.dev/api`;
  const origin = window.location.origin || '';
  return origin.replace(/:3000$/, ':8000') + '/api';
}

export default function Teams() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const base = getApiBase();
    const endpoint = `${base}/teams/`;
    console.log('Fetching Teams from', endpoint);
    fetch(endpoint)
      .then(async (res) => {
        const ct = res.headers.get('content-type') || '';
        if (!res.ok) {
          const txt = await res.text();
          console.error('Teams non-OK response', res.status, txt);
          throw new Error(`HTTP ${res.status}`);
        }
        if (ct.includes('application/json')) return res.json();
        const txt = await res.text();
        console.warn('Teams got non-JSON response:', txt);
        try { return JSON.parse(txt); } catch (e) { throw new Error('Expected JSON but received non-JSON response'); }
      })
      .then((data) => {
        console.log('Teams response:', data);
        const list = Array.isArray(data) ? data : data.results ?? [];
        setItems(list);
      })
      .catch((err) => {
        console.error('Teams fetch error:', err);
        setError(err?.message || String(err));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading teams...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Teams</h3>
          <div>
            <a className="btn btn-sm btn-outline-secondary me-2" href={getApiBase() + '/teams/'} target="_blank" rel="noreferrer">API</a>
          </div>
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Name</th>
                <th>Members</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.id ?? idx}>
                  <td>{idx+1}</td>
                  <td>{it.id ?? '-'}</td>
                  <td>{it.name ?? JSON.stringify(it)}</td>
                  <td>{(it.members && it.members.length) ?? it.size ?? '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => { setSelected(it); setShow(true); }}>View</button>
                    <a className="btn btn-sm btn-outline-secondary" href={getApiBase() + `/teams/${it.id ?? ''}`} target="_blank" rel="noreferrer">Open</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {show && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Team Details</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShow(false)}></button>
              </div>
              <div className="modal-body">
                <pre>{JSON.stringify(selected, null, 2)}</pre>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShow(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
