function Sidebar({ paginaActual, onNavegar, usuario, onLogout }) {
 const items = [
  { id: 'dashboard',   label: 'Panel Principal', icon: '📊' },
  { id: 'productos',   label: 'Productos',        icon: '💊' },
  { id: 'clientes',    label: 'Clientes',          icon: '👥' },
  { id: 'ventas',      label: 'Ventas',            icon: '🛒' },
  { id: 'proveedores', label: 'Proveedores',       icon: '🏭' },
  { id: 'reportes',    label: 'Reportes',          icon: '📈' },
];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">💊</div>
        <div>
          <h2>SistemaFarmacia</h2>
          <p>v1.0 · Farmacia</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section">Menú principal</div>
        {items.map(item => (
          <button
            key={item.id}
            className={`nav-item ${paginaActual === item.id ? 'active' : ''}`}
            onClick={() => onNavegar(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">{usuario?.nombre?.[0] || 'A'}</div>
          <div className="user-info">
            <p>{usuario?.nombre || 'Admin'}</p>
            <span>Administrador</span>
          </div>
        </div>
        <button className="btn-logout" onClick={onLogout}>
          🚪 Cerrar sesión
        </button>
        <div className="status-row">
          <div className="status-dot"></div>
          <span>Sistema activo</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;