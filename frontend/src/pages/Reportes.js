import { useState, useEffect } from 'react';
import { ventasAPI, productosAPI, clientesAPI } from '../api';

function Reportes() {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState('resumen');

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    const [v, p, c] = await Promise.all([ventasAPI.listar(), productosAPI.listar(), clientesAPI.listar()]);
    setVentas(v.data);
    setProductos(p.data);
    setClientes(c.data);
    setLoading(false);
  };

  const mes = new Date().getMonth();
  const año = new Date().getFullYear();
  const ventasMes = ventas.filter(v => new Date(v.fecha).getMonth() === mes);
  const ingresosMes = ventasMes.reduce((s,v) => s + parseFloat(v.total), 0);
  const promedioVenta = ventasMes.length > 0 ? (ingresosMes / ventasMes.length).toFixed(2) : 0;
  const stockBajo = productos.filter(p => p.stock <= p.stock_minimo);
  const ventaMaxima = ventasMes.reduce((max, v) => parseFloat(v.total) > parseFloat(max?.total || 0) ? v : max, null);

  // Ventas por día del mes actual
  const ventasPorDia = {};
  ventasMes.forEach(v => {
    const dia = new Date(v.fecha).getDate();
    ventasPorDia[dia] = (ventasPorDia[dia] || 0) + parseFloat(v.total);
  });

  if (loading) return <div className="loading">⏳ Generando reportes...</div>;

  return (
    <div>
      <div className="header" style={{background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)'}}>
        <div>
          <h1>📈 Reportes</h1>
          <p>Análisis y estadísticas del sistema</p>
        </div>
        <div className="header-badge">
          <div className="amount">Bs. {ingresosMes.toFixed(2)}</div>
          <div className="label">Ingresos del mes</div>
        </div>
      </div>

      <div className="content">
        {/* TABS */}
        <div style={{display:'flex',gap:'8px',marginBottom:'20px'}}>
          {[['resumen','📊 Resumen'],['ventas','🛒 Ventas'],['inventario','📦 Inventario']].map(([id,label]) => (
            <button key={id} className={`btn ${vista===id ? 'btn-primary' : 'btn-outline'}`} onClick={() => setVista(id)}>
              {label}
            </button>
          ))}
        </div>

        {vista === 'resumen' && (
          <>
            <div className="stats-grid" style={{gridTemplateColumns:'repeat(3,1fr)'}}>
              <div className="stat-card sc-purple" data-icon="💰">
                <div className="s-label">Ingresos del mes</div>
                <div className="s-value" style={{fontSize:'22px'}}>Bs. {ingresosMes.toFixed(2)}</div>
                <div className="s-sub">{ventasMes.length} ventas realizadas</div>
              </div>
              <div className="stat-card sc-blue" data-icon="📊">
                <div className="s-label">Promedio por venta</div>
                <div className="s-value" style={{fontSize:'22px'}}>Bs. {promedioVenta}</div>
                <div className="s-sub">ticket promedio</div>
              </div>
              <div className="stat-card sc-red" data-icon="⚠️">
                <div className="s-label">Productos stock bajo</div>
                <div className="s-value">{stockBajo.length}</div>
                <div className="s-sub">requieren reposición</div>
              </div>
            </div>

            {ventaMaxima && (
              <div style={{background:'white',borderRadius:'14px',padding:'20px',marginBottom:'20px',boxShadow:'0 2px 8px rgba(0,0,0,0.06)'}}>
                <h3 style={{fontSize:'15px',fontWeight:'700',marginBottom:'12px'}}>🏆 Venta más alta del mes</h3>
                <div style={{display:'flex',gap:'20px',alignItems:'center'}}>
                  <div style={{background:'linear-gradient(135deg,#667eea,#764ba2)',borderRadius:'12px',padding:'16px 24px',color:'white',textAlign:'center'}}>
                    <div style={{fontSize:'24px',fontWeight:'800'}}>Bs. {ventaMaxima.total}</div>
                    <div style={{fontSize:'12px',opacity:0.85}}>Venta #{ventaMaxima.id}</div>
                  </div>
                  <div>
                    <p style={{fontSize:'14px',color:'#374151'}}><strong>Cliente:</strong> {ventaMaxima.cliente_nombre || 'Venta directa'}</p>
                    <p style={{fontSize:'14px',color:'#374151',marginTop:'4px'}}><strong>Fecha:</strong> {new Date(ventaMaxima.fecha).toLocaleDateString('es-BO')}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="card">
              <h3>📅 Ventas por día — {new Date().toLocaleDateString('es-BO',{month:'long',year:'numeric'})}</h3>
              {Object.keys(ventasPorDia).length === 0 ? (
                <div className="empty-state">Sin ventas este mes</div>
              ) : (
                <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                  {Object.entries(ventasPorDia).sort((a,b)=>a[0]-b[0]).map(([dia, total]) => {
                    const max = Math.max(...Object.values(ventasPorDia));
                    const pct = (total/max)*100;
                    return (
                      <div key={dia} style={{display:'flex',alignItems:'center',gap:'12px'}}>
                        <span style={{width:'60px',fontSize:'13px',color:'#64748b'}}>Día {dia}</span>
                        <div style={{flex:1,background:'#f1f5f9',borderRadius:'6px',height:'28px',overflow:'hidden'}}>
                          <div style={{width:`${pct}%`,height:'100%',background:'linear-gradient(90deg,#667eea,#764ba2)',borderRadius:'6px',display:'flex',alignItems:'center',paddingLeft:'8px'}}>
                            <span style={{color:'white',fontSize:'12px',fontWeight:'600',whiteSpace:'nowrap'}}>Bs. {total.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {vista === 'ventas' && (
          <div className="table-wrap">
            <div style={{padding:'16px',borderBottom:'1px solid #f1f5f9',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <strong>Todas las ventas ({ventas.length})</strong>
              <span style={{color:'#16a34a',fontWeight:'700'}}>Total: Bs. {ventas.reduce((s,v)=>s+parseFloat(v.total),0).toFixed(2)}</span>
            </div>
            <table>
              <thead>
                <tr><th>#</th><th>Cliente</th><th>Total</th><th>Fecha</th><th>Hora</th></tr>
              </thead>
              <tbody>
                {ventas.map(v => (
                  <tr key={v.id}>
                    <td><span className="badge badge-purple">#{v.id}</span></td>
                    <td>{v.cliente_nombre || <span className="badge badge-info">Venta directa</span>}</td>
                    <td><strong style={{color:'#16a34a'}}>Bs. {v.total}</strong></td>
                    <td>{new Date(v.fecha).toLocaleDateString('es-BO')}</td>
                    <td style={{color:'#64748b'}}>{new Date(v.fecha).toLocaleTimeString('es-BO',{hour:'2-digit',minute:'2-digit'})}</td>
                  </tr>
                ))}
                {ventas.length === 0 && <tr><td colSpan="5"><div className="empty-state">Sin ventas registradas</div></td></tr>}
              </tbody>
            </table>
          </div>
        )}

        {vista === 'inventario' && (
          <>
            {stockBajo.length > 0 && (
              <div style={{background:'#fff7ed',border:'1px solid #fed7aa',borderRadius:'12px',padding:'16px',marginBottom:'16px'}}>
                <strong style={{color:'#c2410c'}}>⚠️ {stockBajo.length} productos necesitan reposición urgente</strong>
              </div>
            )}
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Producto</th><th>Stock actual</th><th>Stock mínimo</th><th>P. Venta</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {productos.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.nombre}</strong></td>
                      <td>
                        <span className={`badge ${p.stock <= p.stock_minimo ? 'badge-danger' : p.stock <= p.stock_minimo * 2 ? 'badge-warning' : 'badge-success'}`}>
                          {p.stock} unid.
                        </span>
                      </td>
                      <td>{p.stock_minimo} unid.</td>
                      <td>Bs. {p.precio_venta}</td>
                      <td>
                        <span className={`badge ${p.stock <= p.stock_minimo ? 'badge-danger' : 'badge-success'}`}>
                          {p.stock <= p.stock_minimo ? '⚠️ Reponer' : '✅ OK'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Reportes;