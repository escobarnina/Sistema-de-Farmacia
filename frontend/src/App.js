import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Clientes from './pages/Clientes';
import Ventas from './pages/Ventas';
import Proveedores from './pages/Proveedores';
import Login from './pages/Login';
import Reportes from './pages/Reportes';
import './index.css';

function App() {
  const [pagina, setPagina] = useState('dashboard');
  const [usuario, setUsuario] = useState(null);

  if (!usuario) {
    return <Login onLogin={setUsuario} />;
  }

  const renderPagina = () => {
    switch(pagina) {
      case 'dashboard':   return <Dashboard />;
      case 'productos':   return <Productos />;
      case 'clientes':    return <Clientes />;
      case 'ventas':      return <Ventas />;
      case 'proveedores': return <Proveedores />;
      case 'reportes': return <Reportes />;
      default:            return <Dashboard />;
    }
  };

  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar paginaActual={pagina} onNavegar={setPagina} usuario={usuario} onLogout={() => setUsuario(null)} />
        <main className="main">{renderPagina()}</main>
      </div>
    </BrowserRouter>
  );
}

export default App;