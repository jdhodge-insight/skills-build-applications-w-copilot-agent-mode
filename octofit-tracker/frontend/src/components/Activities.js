import React, { useEffect, useState } from 'react';
import { getApiBase } from '../api';

export default function Activities() {
  const codespaceEndpointTemplate = 'https://$REACT_APP_CODESPACE_NAME-8000.app.github.dev/api/activities/';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const base = getApiBase();
    const endpoint = `${base}/activities/`;
    console.log('Fetching Activities from', endpoint);
    console.log('Activities Codespace endpoint template:', codespaceEndpointTemplate);
    fetch(endpoint)
      .then(async (res) => {
        const ct = res.headers.get('content-type') || '';
        if (!res.ok) {
          const txt = await res.text();
          console.error('Activities non-OK response', res.status, txt);
          throw new Error(`HTTP ${res.status}`);
        }
        if (ct.includes('application/json')) return res.json();
        // Log text response (likely HTML error page) to help debugging
        const txt = await res.text();
        console.warn('Activities got non-JSON response:', txt);
        try {
          return JSON.parse(txt);
        } catch (e) {
          throw new Error('Expected JSON but received non-JSON response');
        }
      })
      .then((data) => {
        console.log('Activities response:', data);
        const list = Array.isArray(data) ? data : data.results ?? [];
        setItems(list);
      })
      .catch((err) => {
        console.error('Activities fetch error:', err);
        setError(err?.message || String(err));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading activities...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h3 className="mb-0">Activities</h3>
          <div>
            <a className="btn btn-sm btn-outline-secondary me-2" href="#" onClick={(e)=>{e.preventDefault(); window.location.reload();}}>Refresh</a>
            <a className="btn btn-sm btn-primary" href={getApiBase() + '/activities/'} target="_blank" rel="noreferrer">API</a>
          </div>
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>Name</th>
                <th>Details</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.id ?? idx}>
                  <td>{idx+1}</td>
                  <td>{it.id ?? '-'}</td>
                  <td>{it.name ?? it.title ?? JSON.stringify(it)}</td>
                  <td><small className="text-muted">{it.description ?? it.summary ?? ''}</small></td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => { setSelected(it); setShow(true); }}>View</button>
                    <a className="btn btn-sm btn-outline-secondary" href={getApiBase() + `/activities/${it.id ?? ''}`} target="_blank" rel="noreferrer">Open</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {show && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{backgroundColor:'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Activity Details</h5>
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
