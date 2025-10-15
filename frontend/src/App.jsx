import React, { useState } from 'react';
import axios from 'axios';
import Login from './components/Login';
import DashboardAdmin from './components/DashboardAdmin';
import DashboardDocente from './components/DashboardDocente';
import DashboardAlumno from './components/DashboardAlumno';
import './App.css';

const API_BASE = '/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (loginData) => {
    setLoading(true);
    try {
      // Por ahora usamos simulación, pero después cambiarás a API real
      const userData = simulateLogin(loginData);
      setUser(userData);
      
      // EJEMPLO de cómo sería con axios en el futuro:
      /*
      const response = await axios.post(`${API_BASE}/auth/login`, {
        username: loginData.username,
        password: loginData.password
      });
      
      if (response.data.success) {
        setUser(response.data.userData);
      } else {
        throw new Error(response.data.message);
      }
      */
      
    } catch (error) {
      console.error('Error en login:', error);
      alert('La contraseña o usuario, no es correcto');
    } finally {
      setLoading(false);
    }
  };

  const simulateLogin = (loginData) => {
    // Datos de ejemplo basados en el tipo de usuario
    const users = {
      admin: {
        username: 'admin',
        password: 'admin123',
        userData: {
          type: 'Administrador',
          username: 'admin',
          name: 'Administrador del Sistema',
          rol: 'admin',
          info: { id_admin: 1, nombre: 'Admin Principal' }
        }
      },
      docente: {
        username: 'docente01',
        password: 'docente123', 
        userData: {
          type: 'Docente',
          username: 'docente01',
          name: 'Prof. Juan Pérez',
          rol: 'docente',
          info: { id_docente: 1, nombre: 'Juan Pérez', especialidad: 'Informática' }
        }
      },
      alumno: {
        username: 'alumno01',
        password: 'alumno123',
        userData: {
          type: 'Alumno', 
          username: 'alumno01',
          name: 'Brian Alexis Aquino Ovando',
          rol: 'alumno',
          info: { 
            id_alumno: 1, 
            nombre: 'Brian Alexis Aquino Ovando', 
            matricula: 'Y200003', 
            grupo: '5°M' 
          }
        }
      }
    };

    const foundUser = Object.values(users).find(u => 
      u.username === loginData.username && u.password === loginData.password
    );

    if (foundUser) {
      return foundUser.userData;
    } else {
      throw new Error('Credenciales incorrectas');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Renderizar el dashboard correspondiente según el rol
  const renderDashboard = () => {
    switch(user.rol) {
      case 'admin':
        return <DashboardAdmin userData={user} onLogout={handleLogout} />;
      case 'docente':
        return <DashboardDocente userData={user} onLogout={handleLogout} />;
      case 'alumno':
        return <DashboardAlumno userData={user} onLogout={handleLogout} />;
      default:
        return <div>Dashboard no disponible para este tipo de usuario</div>;
    }
  };

  return (
    <div className="App">
      {!user ? (
        <Login onLogin={handleLogin} loading={loading} />
      ) : (
        renderDashboard()
      )}
    </div>
  );
}

export default App;