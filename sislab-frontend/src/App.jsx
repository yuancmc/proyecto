import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = '/api';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('admin');
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [horarios, setHorarios] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [laboratorios, setLaboratorios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState({
    laboratoriosActivos: 0,
    usuariosRegistrados: 0,
    asistenciasHoy: 0,
    horariosActivos: 0
  });

  // FUNCIONES PARA CARGAR DATOS REALES DESDE LA BD
  const cargarMetricasAdmin = async () => {
    try {
      const [labRes, usersRes, asisRes, horRes] = await Promise.all([
        axios.get(`${API_BASE}/admin/laboratorios`),
        axios.get(`${API_BASE}/admin/usuarios-detalle`),
        axios.get(`${API_BASE}/admin/asistencias-hoy`),
        axios.get(`${API_BASE}/admin/horarios-hoy`)
      ]);

      const labsActivos = labRes.data.filter(lab => lab.estado === 'disponible').length;
      
      setMetrics({
        laboratoriosActivos: labsActivos,
        usuariosRegistrados: usersRes.data.length,
        asistenciasHoy: asisRes.data.count || 0,
        horariosActivos: horRes.data.count || 0
      });
    } catch (error) {
      console.error('Error cargando métricas:', error);
      setMetrics({
        laboratoriosActivos: laboratorios.filter(lab => lab.estado === 'disponible').length,
        usuariosRegistrados: usuarios.length,
        asistenciasHoy: 0,
        horariosActivos: 0
      });
    }
  };

  const cargarLaboratorios = async () => {
    try {
      const response = await axios.get(`${API_BASE}/laboratorios`);
      setLaboratorios(response.data);
    } catch (error) {
      console.error('Error cargando laboratorios:', error);
    }
  };

  const cargarUsuarios = async () => {
    try {
      const response = await axios.get(`${API_BASE}/admin/usuarios-detalle`);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  const cargarHorariosDocente = async (idDocente) => {
    try {
      const response = await axios.get(`${API_BASE}/docente/horarios/${idDocente}`);
      setHorarios(response.data);
    } catch (error) {
      console.error('Error cargando horarios docente:', error);
    }
  };

  const cargarHorariosAlumno = async (idAlumno) => {
    try {
      const response = await axios.get(`${API_BASE}/alumno/horarios/${idAlumno}`);
      setHorarios(response.data);
    } catch (error) {
      console.error('Error cargando horarios alumno:', error);
    }
  };

  const cargarDatosAdmin = async () => {
    await Promise.all([
      cargarLaboratorios(),
      cargarUsuarios()
    ]);
    await cargarMetricasAdmin();
  };

  // Datos de métricas
  const metricsData = {
    admin: [
      { title: 'Laboratorios Activos', value: metrics.laboratoriosActivos, icon: '🖥️' },
      { title: 'Usuarios Registrados', value: metrics.usuariosRegistrados, icon: '👥' },
      { title: 'Asistencias Hoy', value: metrics.asistenciasHoy, icon: '✅' },
      { title: 'Horarios Activos', value: metrics.horariosActivos, icon: '📅' }
    ],
    docente: [
      { title: 'Mis Clases Hoy', value: horarios.filter(h => h.fecha === new Date().toISOString().split('T')[0]).length, icon: '📚' },
      { title: 'Asistencias Pendientes', value: 12, icon: '⏱️' },
      { title: 'Horarios Semanales', value: horarios.length, icon: '📅' },
      { title: 'Estudiantes', value: 45, icon: '🎓' }
    ],
    alumno: [
      { title: 'Próxima Clase', value: horarios.length > 0 ? `${horarios[0].hora_inicio}` : 'No hay', icon: '⏰' },
      { title: 'Asistencias', value: 28, icon: '✅' },
      { title: 'Clases Semana', value: horarios.length, icon: '📚' },
      { title: 'Promedio Asist.', value: '92%', icon: '📊' }
    ]
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/login`, {
        username,
        password
      });

      if (response.data.success) {
        setLoggedIn(true);
        setUserData(response.data.user);
        
        // Cargar datos según el rol
        if (response.data.user.rol === 'docente') {
          await cargarHorariosDocente(response.data.user.info.id_docente);
        } else if (response.data.user.rol === 'alumno') {
          await cargarHorariosAlumno(response.data.user.info.id_alumno);
        } else if (response.data.user.rol === 'admin') {
          await cargarDatosAdmin();
        }
        
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setUserData(null);
    setUsername('');
    setPassword('');
    setCurrentView('dashboard');
  };

  // COMPONENTES DE LA INTERFAZ
  const Sidebar = () => (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">UNACH</div>
          <span>SISLAB</span>
        </div>
      </div>
      
      <div className="sidebar-nav">
        <div className="nav-section">
          <h3>Navegación Principal</h3>
          <button className="nav-item active">📊 Dashboard</button>
          {userData?.rol === 'admin' && (
            <>
              <button className="nav-item">👥 Usuarios</button>
              <button className="nav-item">🖥️ Laboratorios</button>
              <button className="nav-item">📅 Horarios</button>
            </>
          )}
          {userData?.rol === 'docente' && (
            <>
              <button className="nav-item">📚 Mis Clases</button>
              <button className="nav-item">✅ Asistencias</button>
            </>
          )}
          {userData?.rol === 'alumno' && (
            <>
              <button className="nav-item">📖 Mis Materias</button>
              <button className="nav-item">✅ Mi Asistencia</button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const AdminDashboard = () => (
    <div className="dashboard-content">
      <div className="metrics-grid">
        {metricsData.admin.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-content">
              <h3>{metric.title}</h3>
              <div className="metric-value">{metric.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="content-card">
          <h3>Laboratorios Recientes</h3>
          <div className="recent-list">
            {laboratorios.slice(0, 5).map(lab => (
              <div key={lab.id_laboratorio} className="recent-item">
                <span>{lab.nombre}</span>
                <span className={`status status-${lab.estado}`}>
                  {lab.estado}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="content-card">
          <h3>Usuarios Recientes</h3>
          <div className="recent-list">
            {usuarios.slice(0, 5).map(user => (
              <div key={user.id_usuario} className="recent-item">
                <span>{user.nombre}</span>
                <span className={`role-badge role-${user.rol}`}>
                  {user.rol}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="content-card full-width">
        <h3>Acciones Rápidas</h3>
        <div className="action-buttons">
          <button className="btn-primary">Gestionar Laboratorios</button>
          <button className="btn-secondary">Ver Reportes</button>
          <button className="btn-secondary">Administrar Usuarios</button>
        </div>
      </div>
    </div>
  );

  const DocenteDashboard = () => (
    <div className="dashboard-content">
      <div className="metrics-grid">
        {metricsData.docente.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-content">
              <h3>{metric.title}</h3>
              <div className="metric-value">{metric.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="content-card">
          <h3>Mis Próximas Clases</h3>
          <div className="recent-list">
            {horarios.slice(0, 3).map(horario => (
              <div key={horario.id_clase} className="recent-item">
                <div>
                  <strong>{horario.materia}</strong>
                  <br />
                  <small>{horario.laboratorio} - {horario.grupo}</small>
                  <br />
                  <small>{horario.hora_inicio} - {horario.hora_fin}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-card">
          <h3>Acciones Rápidas</h3>
          <div className="action-buttons vertical">
            <button className="btn-primary">Tomar Asistencia</button>
            <button className="btn-secondary">Ver Mis Horarios</button>
          </div>
        </div>
      </div>
    </div>
  );

  const AlumnoDashboard = () => (
    <div className="dashboard-content">
      <div className="metrics-grid">
        {metricsData.alumno.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-icon">{metric.icon}</div>
            <div className="metric-content">
              <h3>{metric.title}</h3>
              <div className="metric-value">{metric.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        <div className="content-card">
          <h3>Próximas Clases</h3>
          <div className="recent-list">
            {horarios.slice(0, 3).map(horario => (
              <div key={horario.id_clase} className="recent-item">
                <div>
                  <strong>{horario.materia}</strong>
                  <br />
                  <small>Prof. {horario.profesor}</small>
                  <br />
                  <small>{horario.laboratorio}</small>
                  <br />
                  <small>{horario.hora_inicio} - {horario.hora_fin}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="content-card next-class">
          <h3>Mi Información</h3>
          <div className="class-info">
            <h4>{userData?.info?.nombre || 'Estudiante'}</h4>
            <p>Matrícula: {userData?.info?.matricula || 'N/A'}</p>
            <p>Grupo: {userData?.info?.grupo || '5°M'}</p>
            <div className="class-time">Programación Avanzada</div>
          </div>
        </div>
      </div>
    </div>
  );

  // Página de Login
  if (!loggedIn) {
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
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Selecciona el tipo de interfaz (solo visual)</label>
              <div className="user-type-selector">
                {['admin', 'docente', 'alumno'].map(type => (
                  <button
                    key={type}
                    type="button"
                    className={`type-btn ${userType === type ? 'active' : ''}`}
                    onClick={() => setUserType(type)}
                  >
                    {type === 'admin' && '👨‍💼 Administrador'}
                    {type === 'docente' && '👨‍🏫 Docente'}
                    {type === 'alumno' && '🎓 Alumno'}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="username">Usuario</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin, docente01, alumno01"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123, docente123, alumno123"
                required
              />
            </div>
            
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? '🔄 Accediendo...' : '🚀 Iniciar Sesión'}
            </button>
          </form>

          <div className="demo-accounts">
            <h3>Cuentas de Demostración</h3>
            <div className="demo-grid">
              <div className="demo-item">
                <strong>Administrador:</strong>
                <span>admin / admin123</span>
              </div>
              <div className="demo-item">
                <strong>Docente:</strong>
                <span>docente01 / docente123</span>
              </div>
              <div className="demo-item">
                <strong>Alumno:</strong>
                <span>alumno01 / alumno123</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <Sidebar />
      
      <div className="main-content">
        <header className="main-header">
          <div className="header-content">
            <h1>Bienvenido, {userData?.info?.nombre || userData?.username}</h1>
            <div className="header-actions">
              <span className="user-role">{userData?.rol}</span>
              <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
            </div>
          </div>
        </header>

        <main className="main-body">
          {userData?.rol === 'admin' && <AdminDashboard />}
          {userData?.rol === 'docente' && <DocenteDashboard />}
          {userData?.rol === 'alumno' && <AlumnoDashboard />}
        </main>
      </div>
    </div>
  );
}

export default App;