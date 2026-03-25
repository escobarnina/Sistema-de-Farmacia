import { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://127.0.0.1:8000/api';

function Proveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre:'', contacto:'', telefono:'', email:'', direccion:'', activo:true });

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    const r = await axios.get(`${API}/proveedores/`);
    setProveedores(r.data);
  };

  const guardar = async () => {
    try {
      if (editando) await axios.put(`${API}/proveedores/${editando.id}/`, form);
      else await axios.post(`${API}/proveedores/`, form);
      setModal(false);
      setEditando(null);
      setForm({ nombre:'', contacto:'', telefono:'', email:'', direccion:'', activo:true });
      cargar();
    } catch(e) {
      alert('Error: ' + JSON.stringify(e.response?.data));
    }
  };

  const editar = (p) => {
    setEditando(p);
    setForm({ nombre:p.nombre, contacto:p.contacto, telefono:p.telefono, email:p.email, direccion:p.direccion, activo:p.activo });
    setModal(true);
  };

  const eliminar = async (id) => {
    if(window.confirm('¿Eliminar proveedor?')) {
      await axios.delete(`${API}/proveedores/${id}/`);
      cargar();
    }
  };

  const filtrados = proveedores.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <div className="header header-proveedores">
        <div>
          <h1>🏭 Proveedores</h1>
          <p>Gestión de proveedores y distribuidores</p>
        </div>
        <div className="header-badge">
          <div className="amount">{proveedores.filter(p=>p.activo).length}</div>
          <div className="label">Proveedores activos</div>
        </div>
      </div>
      <div className="content">
        <div className="page-header">
          <h2>Lista de Proveedores</h2>
          <button className="btn btn-primary" onClick={() => { setEditando(null); setModal(true); }}>+ Nuevo Proveedor</button>
        </div>
        <div className="search-bar">
          <input placeholder="🔍 Buscar proveedor..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Nombre</th><th>Contacto</th><th>Teléfono</th><th>Email</th><th>Estado</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr><td colSpan="6"><div className="empty-state">Sin proveedores registrados</div></td></tr>
              ) : filtrados.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.nombre}</strong></td>
                  <td>{p.contacto || '—'}</td>
                  <td>{p.telefono || '—'}</td>
                  <td>{p.email || '—'}</td>
                  <td><span className={`badge ${p.activo ? 'badge-success' : 'badge-danger'}`}>{p.activo ? 'Activo' : 'Inactivo'}</span></td>
                  <td style={{display:'flex', gap:'6px'}}>
                    <button className="btn btn-outline btn-sm" onClick={() => editar(p)}>✏️ Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminar(p.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editando ? '✏️ Editar Proveedor' : '🏭 Nuevo Proveedor'}</h2>
            <div className="form-grid">
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label>Nombre del proveedor</label>
                <input value={form.nombre} onChange={e => setForm({...form, nombre:e.target.value})} placeholder="Ej: Distribuidora Médica S.A." />
              </div>
              <div className="form-group">
                <label>Persona de contacto</label>
                <input value={form.contacto} onChange={e => setForm({...form, contacto:e.target.value})} placeholder="Nombre del contacto" />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input value={form.telefono} onChange={e => setForm({...form, telefono:e.target.value})} placeholder="7XXXXXXX" />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="correo@empresa.com" />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select value={form.activo} onChange={e => setForm({...form, activo: e.target.value === 'true'})}>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
              </div>
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label>Dirección</label>
                <input value={form.direccion} onChange={e => setForm({...form, direccion:e.target.value})} placeholder="Zona, Calle, Número" />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={guardar}>💾 Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Proveedores;