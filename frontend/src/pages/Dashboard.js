import { useState, useEffect } from 'react';
import { productosAPI, clientesAPI, ventasAPI } from '../api';

function Dashboard() {
  const [stats, setStats] = useState({ ventasHoy:0, ventasMes:0, ingresosMes:0, ingresosDia:0, productos:0, clientes:0, stockBajo:0 });
  const [ventasRecientes, setVentasRecientes] = useState([]);
  const [stockBajo, setStockBajo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { cargarDatos(); }, []);

  const cargarDatos = async () => {
    try {
      const [prods, clientes, ventas, bajo] = await Promise.all([
        productosAPI.listar(), clientesAPI.listar(),
        ventasAPI.listar(), productosAPI.stockBajo(),
      ]);
      const hoy = new Date().toDateString();
      const mes = new Date().getMonth();
      const ventasHoyList = ventas.data.filter(v => new Date(v.fecha).toDateString() === hoy);
      const ventasMesList = ventas.data.filter(v => new Date(v.fecha).getMonth() === mes);
      setStats({
        ventasHoy: ventasHoyList.length,
        ventasMes: ventasMesList.length,
        ingresosDia: ventasHoyList.reduce((s,v) => s + parseFloat(v.total), 0).toFixed(2),
        ingresosMes: ventasMesList.reduce((s,v) => s + parseFloat(v.total), 0).toFixed(2),
        productos: prods.data.filter(p => p.activo).length,
        clientes: clientes.data.length,
        stockBajo: bajo.data.length,
      });
      setVentasRecientes(ventas.data.slice(0, 6));
      setStockBajo(bajo.data);
    } catch(e) { console.error(e); }
    finally { setLoading(false); }
  };

  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';
  const fecha = new Date().toLocaleDateString('es-BO', {weekday:'long',year:'numeric',month:'long',day:'numeric'});

  if (loading) return <div className="loading">⏳ Cargando datos...</div>;

  return (
    <div>
      <div className="header header-dashboard">
        <div>
          <p style={{opacity:0.75,fontSize:'13px',textTransform:'capitalize'}}>{fecha}</p>
          <h1>{saludo}, Admin 👋</h1>
          <p>Panel de Control — FarmaSystem</p>
        </div>
        <div style={{display:'flex',gap:'12px'}}>
          <div className="header-badge">
            <div className="amount">Bs. {stats.ingresosDia}</div>
            <div className="label">Ingresos hoy</div>
          </div>
          <div className="header-badge">
            <div className="amount">Bs. {stats.ingresosMes}</div>
            <div className="label">Ingresos del mes</div>
          </div>
        </div>
      </div>

      <div className="content">
        {/* STATS */}
        <div className="stats-grid">
          <div className="stat-card sc-purple" data-icon="🛒">
            <div className="s-label">Ventas hoy</div>
            <div className="s-value">{stats.ventasHoy}</div>
            <div className="s-sub">transacciones</div>
          </div>
          <div className="stat-card sc-green" data-icon="📊">
            <div className="s-label">Ventas del mes</div>
            <div className="s-value">{stats.ventasMes}</div>
            <div className="s-sub">este mes</div>
          </div>
          <div className="stat-card sc-blue" data-icon="💊">
            <div className="s-label">Productos activos</div>
            <div className="s-value">{stats.productos}</div>
            <div className="s-sub">en inventario</div>
          </div>
          <div className="stat-card sc-orange" data-icon="👥">
            <div className="s-label">Clientes</div>
            <div className="s-value">{stats.clientes}</div>
            <div className="s-sub">registrados</div>
          </div>
          {stats.stockBajo > 0 && (
            <div className="stat-card sc-red" data-icon="⚠️">
              <div className="s-label">Stock bajo</div>
              <div className="s-value">{stats.stockBajo}</div>
              <div className="s-sub">¡Requiere atención!</div>
            </div>
          )}
        </div>

        {/* ALERTA STOCK BAJO */}
        {stockBajo.length > 0 && (
          <div style={{background:'#fff7ed',border:'1px solid #fed7aa',borderRadius:'12px',padding:'16px',marginBottom:'20px',display:'flex',alignItems:'center',gap:'12px'}}>
            <span style={{fontSize:'24px'}}>⚠️</span>
            <div>
              <strong style={{color:'#c2410c'}}>¡Atención! {stockBajo.length} producto(s) con stock bajo</strong>
              <p style={{color:'#9a3412',fontSize:'13px',marginTop:'2px'}}>{stockBajo.map(p=>p.nombre).join(', ')}</p>
            </div>
          </div>
        )}

        <div className="cards-row">
          {/* VENTAS RECIENTES */}
          <div className="card">
            <h3>📋 Ventas recientes</h3>
            <table>
              <thead>
                <tr><th>#</th><th>Cliente</th><th>Total</th><th>Fecha</th></tr>
              </thead>
              <tbody>
                {ventasRecientes.length === 0 ? (
                  <tr><td colSpan="4"><div className="empty-state">Sin ventas aún</div></td></tr>
                ) : ventasRecientes.map(v => (
                  <tr key={v.id}>
                    <td><span className="badge badge-purple">#{v.id}</span></td>
                    <td>{v.cliente_nombre || <span className="badge badge-info">Directo</span>}</td>
                    <td><strong style={{color:'#16a34a'}}>Bs. {v.total}</strong></td>
                    <td style={{color:'#64748b'}}>{new Date(v.fecha).toLocaleDateString('es-BO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* STOCK BAJO */}
          <div className="card">
            <h3>⚠️ Control de stock</h3>
            {stockBajo.length === 0 ? (
              <div className="empty-state">✅ Todo el inventario está bien</div>
            ) : (
              <table>
                <thead>
                  <tr><th>Producto</th><th>Stock actual</th><th>Mínimo</th><th>Estado</th></tr>
                </thead>
                <tbody>
                  {stockBajo.map(p => (
                    <tr key={p.id}>
                      <td><strong>{p.nombre}</strong></td>
                      <td><span className="badge badge-danger">{p.stock}</span></td>
                      <td>{p.stock_minimo}</td>
                      <td><span className="badge badge-warning">Stock bajo</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;