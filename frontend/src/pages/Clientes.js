import { useState, useEffect } from 'react';
import { clientesAPI } from '../api';

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({ nombre:'', ci:'', telefono:'', direccion:'' });

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    const r = await clientesAPI.listar();
    setClientes(r.data);
  };

  const guardar = async () => {
    try {
      if (editando) await clientesAPI.actualizar(editando.id, form);
      else await clientesAPI.crear(form);
      setModal(false);
      setEditando(null);
      setForm({ nombre:'', ci:'', telefono:'', direccion:'' });
      cargar();
    } catch(e) {
      alert('Error: ' + JSON.stringify(e.response?.data));
    }
  };

  const editar = (c) => {
    setEditando(c);
    setForm({ nombre:c.nombre, ci:c.ci, telefono:c.telefono, direccion:c.direccion });
    setModal(true);
  };

  const eliminar = async (id) => {
    if(window.confirm('¿Eliminar este cliente?')) {
      await clientesAPI.eliminar(id);
      cargar();
    }
  };

  const filtrados = clientes.filter(c =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.ci.includes(busqueda)
  );

  return (
    <div>
      <div className="header">
        <div><h1>👥 Clientes</h1><p>Registro de clientes de la farmacia</p></div>
      </div>
      <div className="content">
        <div className="page-header">
          <h2>Lista de Clientes</h2>
          <button className="btn btn-primary" onClick={() => { setEditando(null); setModal(true); }}>+ Nuevo Cliente</button>
        </div>
        <div className="search-bar">
          <input placeholder="🔍 Buscar por nombre o CI..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        <div className="card">
          <table>
            <thead>
              <tr><th>Nombre</th><th>CI/NIT</th><th>Teléfono</th><th>Dirección</th><th>Registro</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {filtrados.map(c => (
                <tr key={c.id}>
                  <td><strong>{c.nombre}</strong></td>
                  <td>{c.ci}</td>
                  <td>{c.telefono || '—'}</td>
                  <td>{c.direccion || '—'}</td>
                  <td>{new Date(c.fecha_registro).toLocaleDateString('es-BO')}</td>
                  <td style={{display:'flex',gap:'8px'}}>
                    <button className="btn btn-outline" style={{padding:'4px 10px'}} onClick={() => editar(c)}>✏️</button>
                    <button className="btn btn-danger" style={{padding:'4px 10px'}} onClick={() => eliminar(c.id)}>🗑️</button>
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
            <h2>{editando ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
            <div className="form-grid">
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label>Nombre completo</label>
                <input value={form.nombre} onChange={e => setForm({...form, nombre:e.target.value})} placeholder="Ej: Juan Pérez" />
              </div>
              <div className="form-group">
                <label>CI / NIT</label>
                <input value={form.ci} onChange={e => setForm({...form, ci:e.target.value})} placeholder="12345678" />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input value={form.telefono} onChange={e => setForm({...form, telefono:e.target.value})} placeholder="7XXXXXXX" />
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

export default Clientes;