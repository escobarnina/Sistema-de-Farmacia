function Sidebar({ paginaActual, onNavegar }) {
  const items = [
    { id: 'dashboard', label: 'Panel Principal', icon: '🏠' },
    { id: 'productos', label: 'Productos', icon: '💊' },
    { id: 'clientes', label: 'Clientes', icon: '👥' },
    { id: 'ventas', label: 'Ventas', icon: '🛒' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h2>💊 FarmaSystem</h2>
        <p>v1.0 · Sistema de Farmacia</p>
      </div>
      <nav className="sidebar-nav">
        <p style={{padding:'8px 20px',fontSize:'11px',color:'#475569',textTransform:'uppercase',letterSpacing:'1px'}}>Navegación</p>
        {items.map(item => (
          <button
            key={item.id}
            className={`nav-item ${paginaActual === item.id ? 'active' : ''}`}
            onClick={() => onNavegar(item.id)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <p style={{fontSize:'11px',color:'#475569',textTransform:'uppercase',marginBottom:'8px'}}>Estado del sistema</p>
        <p style={{fontSize:'13px',color:'#94a3b8'}}><span className="status-dot"></span>Backend conectado</p>
        <p style={{fontSize:'13px',color:'#94a3b8',marginTop:'4px'}}><span className="status-dot"></span>Base de datos activa</p>
      </div>
    </aside>
  );
}

export default Sidebar;