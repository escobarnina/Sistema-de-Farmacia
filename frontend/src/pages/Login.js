import { useState } from 'react';

function Login({ onLogin }) {
  const [form, setForm] = useState({ usuario: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (form.usuario === 'melina' && form.password === 'melina123') {
      onLogin({ nombre: 'melina', usuario: 'melina' });
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: 'white', borderRadius: '20px', padding: '40px',
        width: '100%', maxWidth: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{textAlign:'center', marginBottom:'32px'}}>
          <div style={{fontSize:'48px', marginBottom:'8px'}}></div>
          <h1 style={{fontSize:'24px', fontWeight:'800', color:'#1a1a2e'}}>SistemaFarmacia</h1>
          <p style={{color:'#64748b', fontSize:'14px', marginTop:'4px'}}>Sistema de Gestión de Farmacia</p>
        </div>

        {error && (
          <div style={{
            background:'#fee2e2', color:'#dc2626', padding:'10px 14px',
            borderRadius:'10px', fontSize:'13px', marginBottom:'16px',
            border:'1px solid #fca5a5'
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{display:'flex', flexDirection:'column', gap:'14px'}}>
          <div className="form-group">
            <label>Usuario</label>
            <input
              type="text"
              placeholder="admin"
              value={form.usuario}
              onChange={e => setForm({...form, usuario: e.target.value})}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
            />
          </div>
          <button
            className="btn btn-primary"
            style={{width:'100%', justifyContent:'center', padding:'12px', marginTop:'4px', fontSize:'15px'}}
            onClick={handleLogin}
          >
            🔐 Iniciar sesión
          </button>
        </div>
        <p style={{textAlign:'center', color:'#94a3b8', fontSize:'12px', marginTop:'20px'}}>
          Usuario: <strong>admin</strong> · Contraseña: <strong>admin123</strong>
        </p>
      </div>
    </div>
  );
}

export default Login;