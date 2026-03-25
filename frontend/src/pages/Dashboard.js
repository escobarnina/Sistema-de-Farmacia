import { useState, useEffect } from 'react';
import { productosAPI, clientesAPI, ventasAPI } from '../api';

function Dashboard() {
  const [stats, setStats] = useState({
    ventasHoy: 0, ventasMes: 0, ingresosMes: 0,
    productos: 0, clientes: 0, stockBajo: 0
  });
  const [ventasRecientes, setVentasRecientes] = useState([]);
  const [stockBajo, setStockBajo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [prods, clientes, ventas, bajo] = await Promise.all([
        productosAPI.listar(),
        clientesAPI.listar(),
        ventasAPI.listar(),
        productosAPI.stockBajo(),
      ]);

      const hoy = new Date().toDateString();
      const mes = new Date().getMonth();
      const ventasHoy = ventas.data.filter(v => new Date(v.fecha).toDateString() === hoy);
      const ventasMes = ventas.data.filter(v => new Date(v.fecha).getMonth() === mes);
      const ingresosMes = ventasMes.reduce((sum, v) => sum + parseFloat(v.total), 0);

      setStats({
        ventasHoy: ventasHoy.length,
        ventasMes: ventasMes.length,
        ingresosMes: ingresosMes.toFixed(2),
        productos: prods.data.filter(p => p.activo).length,
        clientes: clientes.data.length,
        stockBajo: bajo.data.length,
      });

      setVentasRecientes(ventas.data.slice(0, 5));
      setStockBajo(bajo.data.slice(0, 5));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const hora = new Date().getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';
  const fecha = new Date().toLocaleDateString('es-BO', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  if (loading) return <div className="loading">Cargando datos...</div>;

  return (
    <div>
      <div className="header">
        <div>
          <p style={{opacity:0.7,fontSize:'14px',textTransform:'capitalize'}}>{fecha}</p>
          <h1>{saludo}, Admin 👋</h1>
          <p>Panel de Control — FarmaSystem</p>
        </div>
        <div className="header-badge">
          <div className="amount">Bs. {stats.ingresosMes}</div>
          <div className="label">Ingresos del mes</div>
        </div>
      </div>

      <div className="content">
        <div className="stats-grid">
          <div className="stat-card blue">
            <span className="icon">🛒</span>
            <span className="value">{stats.ventasHoy}</span>
            <span className="label">Ventas hoy</span>
            <span className="sublabel">transacciones</span>
          </div>
          <div className="stat-card green">
            <span className="icon">📊</span>
            <span className="value">{stats.ventasMes}</span>
            <span className="label">Ventas del mes</span>
            <span className="sublabel">Este mes</span>
          </div>
          <div className="stat-card purple">
            <span className="icon">💊</span>
            <span className="value">{stats.productos}</span>
            <span className="label">Productos activos</span>
            <span className="sublabel">en inventario</span>
          </div>
          <div className="stat-card orange">
            <span className="icon">👥</span>
            <span className="value">{stats.clientes}</span>
            <span className="label">Clientes</span>
            <span className="sublabel">registrados</span>
          </div>
          {stats.stockBajo > 0 && (
            <div className="stat-card red">
              <span className="icon">⚠️</span>
              <span className="value">{stats.stockBajo}</span>
              <span className="label">Stock bajo</span>
              <span className="sublabel">¡Requiere atención!</span>
            </div>
          )}
        </div>

        <div className="cards-row">
          <div className="card">
            <h3>📋 Ventas recientes</h3>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {ventasRecientes.length === 0 ? (
                  <tr><td colSpan="4" style={{textAlign:'center',color:'#94a3b8'}}>Sin ventas aún</td></tr>
                ) : ventasRecientes.map(v => (
                  <tr key={v.id}>
                    <td>#{v.id}</td>
                    <td>{v.cliente_nombre || 'Sin cliente'}</td>
                    <td><strong style={{color:'#16a34a'}}>Bs. {v.total}</strong></td>
                    <td>{new Date(v.fecha).toLocaleDateString('es-BO')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h3>⚠️ Productos con stock bajo</h3>
            {stockBajo.length === 0 ? (
              <p style={{color:'#94a3b8',textAlign:'center',padding:'20px'}}>✅ Todo el stock está bien</p>
            ) : (
              <table>
                <thead>
                  <tr><th>Producto</th><th>Stock</th><th>Mínimo</th></tr>
                </thead>
                <tbody>
                  {stockBajo.map(p => (
                    <tr key={p.id}>
                      <td>{p.nombre}</td>
                      <td><span className="badge badge-danger">{p.stock}</span></td>
                      <td>{p.stock_minimo}</td>
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