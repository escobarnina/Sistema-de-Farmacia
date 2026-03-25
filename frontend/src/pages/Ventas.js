import { useState, useEffect } from 'react';
import { ventasAPI, productosAPI, clientesAPI } from '../api';

function Ventas() {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ cliente: '', observacion: '', detalles: [] });
  const [productoSel, setProductoSel] = useState('');
  const [cantidadSel, setCantidadSel] = useState(1);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    const [v, p, c] = await Promise.all([ventasAPI.listar(), productosAPI.listar(), clientesAPI.listar()]);
    setVentas(v.data);
    setProductos(p.data.filter(p => p.activo && p.stock > 0));
    setClientes(c.data);
  };

  const agregarDetalle = () => {
    if (!productoSel) return;
    const prod = productos.find(p => p.id === parseInt(productoSel));
    const existe = form.detalles.find(d => d.producto === prod.id);
    if (existe) return alert('Producto ya agregado');
    setForm({...form, detalles: [...form.detalles, {
      producto: prod.id,
      nombre: prod.nombre,
      cantidad: cantidadSel,
      precio_unitario: parseFloat(prod.precio_venta),
      subtotal: cantidadSel * parseFloat(prod.precio_venta)
    }]});
    setProductoSel('');
    setCantidadSel(1);
  };

  const quitarDetalle = (id) => {
    setForm({...form, detalles: form.detalles.filter(d => d.producto !== id)});
  };

  const totalVenta = form.detalles.reduce((s, d) => s + d.subtotal, 0);

  const guardar = async () => {
    if (form.detalles.length === 0) return alert('Agrega al menos un producto');
    try {
      await ventasAPI.crear({
        cliente: form.cliente || null,
        observacion: form.observacion,
        detalles: form.detalles
      });
      setModal(false);
      setForm({ cliente: '', observacion: '', detalles: [] });
      cargar();
    } catch(e) {
      alert('Error: ' + JSON.stringify(e.response?.data));
    }
  };

  return (
    <div>
      <div className="header">
        <div><h1>🛒 Ventas</h1><p>Registro de ventas y transacciones</p></div>
      </div>
      <div className="content">
        <div className="page-header">
          <h2>Historial de Ventas</h2>
          <button className="btn btn-success" onClick={() => setModal(true)}>+ Nueva Venta</button>
        </div>
        <div className="card">
          <table>
            <thead>
              <tr><th>#</th><th>Cliente</th><th>Total</th><th>Fecha</th><th>Hora</th></tr>
            </thead>
            <tbody>
              {ventas.map(v => (
                <tr key={v.id}>
                  <td><strong>#{v.id}</strong></td>
                  <td>{v.cliente_nombre || <span className="badge badge-info">Venta directa</span>}</td>
                  <td><strong style={{color:'#16a34a'}}>Bs. {v.total}</strong></td>
                  <td>{new Date(v.fecha).toLocaleDateString('es-BO')}</td>
                  <td>{new Date(v.fecha).toLocaleTimeString('es-BO', {hour:'2-digit',minute:'2-digit'})}</td>
                </tr>
              ))}
              {ventas.length === 0 && (
                <tr><td colSpan="5" style={{textAlign:'center',color:'#94a3b8',padding:'40px'}}>Sin ventas registradas</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <div className="modal-overlay" onClick={() => setModal(false)}>
          <div className="modal" style={{maxWidth:'640px'}} onClick={e => e.stopPropagation()}>
            <h2>🛒 Nueva Venta</h2>
            <div className="form-group" style={{marginBottom:'16px'}}>
              <label>Cliente (opcional)</label>
              <select value={form.cliente} onChange={e => setForm({...form, cliente:e.target.value})}>
                <option value="">Venta directa / sin cliente</option>
                {clientes.map(c => <option key={c.id} value={c.id}>{c.nombre} - {c.ci}</option>)}
              </select>
            </div>

            <div style={{display:'flex',gap:'8px',marginBottom:'16px',alignItems:'flex-end'}}>
              <div className="form-group" style={{flex:2}}>
                <label>Producto</label>
                <select value={productoSel} onChange={e => setProductoSel(e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {productos.map(p => <option key={p.id} value={p.id}>{p.nombre} — Bs.{p.precio_venta} (Stock:{p.stock})</option>)}
                </select>
              </div>
              <div className="form-group" style={{flex:1}}>
                <label>Cantidad</label>
                <input type="number" min="1" value={cantidadSel} onChange={e => setCantidadSel(parseInt(e.target.value))} />
              </div>
              <button className="btn btn-primary" onClick={agregarDetalle}>+ Agregar</button>
            </div>

            {form.detalles.length > 0 && (
              <table style={{marginBottom:'16px'}}>
                <thead>
                  <tr><th>Producto</th><th>Cant.</th><th>P. Unit.</th><th>Subtotal</th><th></th></tr>
                </thead>
                <tbody>
                  {form.detalles.map(d => (
                    <tr key={d.producto}>
                      <td>{d.nombre}</td>
                      <td>{d.cantidad}</td>
                      <td>Bs. {d.precio_unitario}</td>
                      <td><strong>Bs. {d.subtotal.toFixed(2)}</strong></td>
                      <td><button className="btn btn-danger" style={{padding:'2px 8px'}} onClick={() => quitarDetalle(d.producto)}>✕</button></td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="3"><strong>TOTAL</strong></td>
                    <td colSpan="2"><strong style={{color:'#16a34a',fontSize:'18px'}}>Bs. {totalVenta.toFixed(2)}</strong></td>
                  </tr>
                </tbody>
              </table>
            )}

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setModal(false)}>Cancelar</button>
              <button className="btn btn-success" onClick={guardar}>✅ Confirmar Venta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Ventas;