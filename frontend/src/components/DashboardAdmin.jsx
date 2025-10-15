import React, { useState, useEffect } from 'react';
import '../App.css';

const DashboardAdmin = ({ userData, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('laboratorios');
  const [laboratorios, setLaboratorios] = useState([]);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    // Datos de ejemplo - reemplazar con API real
    setLaboratorios([
      { 
        id_laboratorio: 1, 
        nombre: 'Laboratorio 1', 
        estado: 'disponible',
        capacidad: 25,
        equipos: 20
      },
      { 
        id_laboratorio: 2, 
        nombre: 'Laboratorio 2', 
        estado: 'ocupado',
        capacidad: 30,
        equipos: 25
      },
      { 
        id_laboratorio: 3, 
        nombre: 'Laboratorio 3', 
        estado: 'disponible',
        capacidad: 20,
        equipos: 18
      },
      { 
        id_laboratorio: 4, 
        nombre: 'Laboratorio 4', 
        estado: 'mantenimiento',
        capacidad: 15,
        equipos: 12
      }
    ]);

    setUsuarios([
      { id_usuario: 1, nombre: 'Ana García', tipo: 'Docente', email: 'ana@unach.mx' },
      { id_usuario: 2, nombre: 'Carlos López', tipo: 'Alumno', matricula: 'A12345' },
      { id_usuario: 3, nombre: 'María Rodríguez', tipo: 'Docente', email: 'maria@unach.mx' },
      { id_usuario: 4, nombre: 'Pedro Martínez', tipo: 'Alumno', matricula: 'A12346' }
    ]);
  }, []);

  const metricsData = [
    { title: 'Laboratorios Activos', value: '3/4', icon: '🖥️' },
    { title: 'Usuarios Registrados', value: '156', icon: '👥' },
    { title: 'Asistencias Hoy', value: '23', icon: '✅' },
    { title: 'Horarios Activos', value: '15', icon: '📅' }
  ];

  const renderLaboratorios = () => (
    <div className="laboratorios-section">
      <h2>Laboratorios</h2>
      <div className="laboratorios-grid">
        {laboratorios.map(lab => (
          <div key={lab.id_laboratorio} className="laboratorio-card">
            <h3>{lab.nombre}</h3>
            <div className="lab-info">
              <span className={`estado ${lab.estado}`}>
                {lab.estado.charAt(0).toUpperCase() + lab.estado.slice(1)}
              </span>
              <div className="lab-details">
                <span>Capacidad: {lab.capacidad}</span>
                <span>Equipos: {lab.equipos}</span>
              </div>
            </div>
            <button className="gestionar-btn">Gestionar</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderGestionHorarios = () => (
    <div className="gestion-section">
      <h2>Gestión de Horarios</h2>
      <div className="info-card">
        <p>Al dar click al botón, se abre un sistema CRUD, para asignar horarios, laboratorios, docentes.</p>
        <button className="action-btn">Abrir Gestión de Horarios</button>
      </div>
    </div>
  );

  const renderAlumnos = () => (
    <div className="alumnos-section">
      <h2>Gestión de Alumnos</h2>
      <div className="info-card">
        <p>Al dar click al botón, se abre un sistema CRUD, para editar información de los alumnos: nombre, matrícula, horario, etc.</p>
        <button className="action-btn">Abrir Gestión de Alumnos</button>
      </div>
      <div className="usuarios-table">
        <h3>Usuarios Registrados</h3>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Email/Matrícula</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(user => (
              <tr key={user.id_usuario}>
                <td>{user.nombre}</td>
                <td>
                  <span className={`badge ${user.tipo.toLowerCase()}`}>
                    {user.tipo}
                  </span>
                </td>
                <td>{user.email || user.matricula}</td>
                <td>
                  <button className="btn-editar">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderReportes = () => (
    <div className="reportes-section">
      <h2>Reportes</h2>
      <div className="info-card">
        <p>Al dar click al botón, se abre opción para exportar los reportes mensuales de asistencias.</p>
        <div className="report-actions">
          <button className="action-btn">Generar Reporte Mensual</button>
          <button className="action-btn">Reporte de Asistencias</button>
          <button className="action-btn">Reporte de Uso de Laboratorios</button>
        </div>
      </div>
    </div>
  );

  const renderPermisos = () => (
    <div className="permisos-section">
      <h2>Permisos</h2>
      <div className="info-card">
        <p>Al dar click al botón, el admin asigna el permiso a los alumnos o docentes que tengan falta justificada.</p>
        <button className="action-btn">Gestionar Permisos</button>
      </div>
      <div className="solicitudes-pendientes">
        <h3>Solicitudes Pendientes</h3>
        <div className="solicitud-card">
          <div className="solicitud-info">
            <strong>Juan Pérez</strong>
            <span>Alumno - Matrícula: A12347</span>
            <span>Fecha falta: 2024-01-15</span>
            <span>Motivo: Consulta médica</span>
          </div>
          <div className="solicitud-actions">
            <button className="btn-aprobar">Aprobar</button>
            <button className="btn-rechazar">Rechazar</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeMenu) {
      case 'laboratorios':
        return renderLaboratorios();
      case 'horarios':
        return renderGestionHorarios();
      case 'alumnos':
        return renderAlumnos();
      case 'reportes':
        return renderReportes();
      case 'permisos':
        return renderPermisos();
      default:
        return renderLaboratorios();
    }
  };

  return (
    <div className="dashboard-admin">
      {/* Header */}
      <header className="admin-header">
        <div className="header-left">
          <div className="logo">
            <span>UNACH</span>
          </div>
          <h1>Administrador SISLAB</h1>
        </div>
        <div className="header-right">
          <span className="user-info">usuario: {userData?.username || 'admin'}</span>
          <button onClick={onLogout} className="logout-btn">Cerrar sesión</button>
        </div>
      </header>

      <div className="admin-container">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            <div 
              className={`nav-item ${activeMenu === 'laboratorios' ? 'active' : ''}`}
              onClick={() => setActiveMenu('laboratorios')}
            >
              🖥️ Laboratorios
            </div>
            <div 
              className={`nav-item ${activeMenu === 'horarios' ? 'active' : ''}`}
              onClick={() => setActiveMenu('horarios')}
            >
              📅 Gestión de horarios
            </div>
            <div 
              className={`nav-item ${activeMenu === 'alumnos' ? 'active' : ''}`}
              onClick={() => setActiveMenu('alumnos')}
            >
              👥 Alumnos
            </div>
            <div 
              className={`nav-item ${activeMenu === 'reportes' ? 'active' : ''}`}
              onClick={() => setActiveMenu('reportes')}
            >
              📊 Reportes
            </div>
            <div 
              className={`nav-item ${activeMenu === 'permisos' ? 'active' : ''}`}
              onClick={() => setActiveMenu('permisos')}
            >
              🔐 Permisos
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          {/* Metrics Cards */}
          <div className="metrics-grid">
            {metricsData.map((metric, index) => (
              <div key={index} className="metric-card">
                <div className="metric-icon">{metric.icon}</div>
                <div className="metric-content">
                  <h3>{metric.title}</h3>
                  <div className="metric-value">{metric.value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Dynamic Content */}
          <div className="content-area">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardAdmin;