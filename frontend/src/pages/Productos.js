import { useState, useEffect } from 'react';
import { productosAPI, categoriasAPI } from '../api';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState(null);
  const [form, setForm] = useState({
    nombre:'', descripcion:'', categoria:'', precio_compra:'',
    precio_venta:'', stock:'', stock_minimo:'5', activo:true
  });

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    const [p, c] = await Promise.all([productosAPI.listar(), categoriasAPI.listar()]);
    setProductos(p.data);
    setCategorias(c.data);
  };

  const guardar = async () => {
    try {
      if (editando) {
        await productosAPI.actualizar(editando.id, form);
      } else {
        await productosAPI.crear(form);
      }
      setModal(false);
      setEditando(null);
      setForm({ nombre:'', descripcion:'', categoria:'', precio_compra:'', precio_venta:'', stock:'', stock_minimo:'5', activo:true });
      cargar();
    } catch(e) {
      alert('Error al guardar: ' + JSON.stringify(e.response?.data));
    }
  };

  const editar = (p) => {
    setEditando(p);
    setForm({ nombre:p.nombre, descripcion:p.descripcion, categoria:p.categoria || '', precio_compra:p.precio_compra, precio_venta:p.precio_venta, stock:p.stock, stock_minimo:p.stock_minimo, activo:p.activo });
    setModal(true);
  };

  const eliminar = async (id) => {
    if(window.confirm('¿Eliminar este producto?')) {
      await productosAPI.eliminar(id);
      cargar();
    }
  };

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <div className="header">
        <div>
          <h1>💊 Productos</h1>
          <p>Gestión de medicamentos e inventario</p>
        </div>
      </div>
      <div className="content">
        <div className="page-header">
          <h2>Inventario de Productos</h2>
          <button className="btn btn-primary" onClick={() => { setEditando(null); setModal(true); }}>
            + Nuevo Producto
          </button>
        </div>
        <div className="search-bar">
          <input placeholder="🔍 Buscar producto..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
        </div>
        <div className="card">
          <table>
            <thead>
              <tr>
                <th>Nombre</th><th>Categoría</th><th>P. Compra</th>
                <th>P. Venta</th><th>Stock</th><th>Estado</th><th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.nombre}</strong></td>
                  <td>{p.categoria_nombre || '—'}</td>
                  <td>Bs. {p.precio_compra}</td>
                  <td>Bs. {p.precio_venta}</td>
                  <td>
                    <span className={`badge ${p.stock <= p.stock_minimo ? 'badge-danger' : 'badge-success'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td><span className={`badge ${p.activo ? 'badge-success' : 'badge-danger'}`}>{p.activo ? 'Activo' : 'Inactivo'}</span></td>
                  <td style={{display:'flex',gap:'8px'}}>
                    <button className="btn btn-outline" style={{padding:'4px 10px'}} onClick={() => editar(p)}>✏️</button>
                    <button className="btn btn-danger" style={{padding:'4px 10px'}} onClick={() => eliminar(p.id)}>🗑️</button>
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
            <h2>{editando ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <div className="form-grid">
              <div className="form-group" style={{gridColumn:'1/-1'}}>
                <label>Nombre del medicamento</label>
                <input value={form.nombre} onChange={e => setForm({...form, nombre:e.target.value})} placeholder="Ej: Paracetamol 500mg" />
              </div>
              <div className="form-group">
                <label>Categoría</label>
                <select value={form.categoria} onChange={e => setForm({...form, categoria:e.target.value})}>
                  <option value="">Sin categoría</option>
                  {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Stock mínimo</label>
                <input type="number" value={form.stock_minimo} onChange={e => setForm({...form, stock_minimo:e.target.value})} />
              </div>
              <div className="form-group">
                <label>Precio de compra (Bs.)</label>
                <input type="number" value={form.precio_compra} onChange={e => setForm({...form, precio_compra:e.target.value})} />
              </div>
              <div className="form-group">
                <label>Precio de venta (Bs.)</label>
                <input type="number" value={form.precio_venta} onChange={e => setForm({...form, precio_venta:e.target.value})} />
              </div>
              <div className="form-group">
                <label>Stock actual</label>
                <input type="number" value={form.stock} onChange={e => setForm({...form, stock:e.target.value})} />
              </div>
              <div className="form-group">
                <label>Estado</label>
                <select value={form.activo} onChange={e => setForm({...form, activo:e.target.value === 'true'})}>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </select>
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

export default Productos;