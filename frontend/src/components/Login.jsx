import React, { useState } from 'react';
import '../Login.css';

const Login = ({ onLogin, loading }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Enviar solo usuario y contraseña, el rol se determinará en el backend
    onLogin({ username, password });
  };

  const demoAccounts = {
    admin: { user: 'admin', pass: 'admin123' },
    docente: { user: 'docente01', pass: 'docente123' },
    alumno: { user: 'alumno01', pass: 'alumno123' }
  };

  const fillDemo = (type) => {
    setUsername(demoAccounts[type].user);
    setPassword(demoAccounts[type].pass);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="unach-logo">
            <div className="logo-main">
              <span>UNACH</span>
            </div>
          </div>
          <h1>Universidad Autónoma de Chiapas</h1>
          <h2>Sistema de Gestión de Laboratorios - SISLAB</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="input-label">Usuario</label>
            <input
              type="text"
              className="form-input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su usuario"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="input-label">Contraseña</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              required
            />
          </div>
          
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? '🔄 Accediendo...' : 'Acceder al Sistema'}
          </button>
        </form>

        <div className="forgot-password">
          <a href="#">¿Olvidaste tu contraseña?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;