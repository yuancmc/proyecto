import React, { useState, useEffect } from 'react';
import '../App.css';

const DashboardAlumno = ({ userData, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('qr');
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    // Datos de ejemplo para asistencias
    setAsistencias([
      { fecha: '21/09/2024', estado: 'Presente', materia: 'Programación Avanzada' },
      { fecha: '20/09/2024', estado: 'Presente', materia: 'Base de Datos' },
      { fecha: '18/09/2024', estado: 'Ausente', materia: 'Redes de Computadoras' },
      { fecha: '17/09/2024', estado: 'Presente', materia: 'Sistemas Operativos' },
      { fecha: '16/09/2024', estado: 'Presente', materia: 'Programación Avanzada' }
    ]);
  }, []);

  const metricsData = [
    { title: 'Asistencias Totales', value: '28', icon: '✅' },
    { title: 'Asistencias Mes', value: '15', icon: '📅' },
    { title: 'Porcentaje Asist.', value: '92%', icon: '📊' },
    { title: 'Clases Esta Semana', value: '5', icon: '📚' }
  ];

  const generarQR = () => {
    // En una implementación real, esto generaría un QR único para el alumno
    return "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + 
           encodeURIComponent(`ALUMNO:${userData?.username || 'alumno01'}|MATRICULA:${userData?.matricula || 'Y200003'}`);
  };

  const renderQR = () => (
    <div className="qr-section">
      <h2>Mi QR y Asistencias</h2>
      <div className="alumno-info-card">
        <div className="alumno-header">
          <h3>Brian Alexis Aquino Ovando</h3>
          <p className="matricula">Matricula: Y200003</p>
        </div>
        
        <div className="qr-content">
          <div className="qr-container">
            <h4>Mi Código QR</h4>
            <div className="qr-code">
              <img src={generarQR()} alt="Código QR del alumno" />
            </div>
            <p className="qr-instructions">
              Muestra este QR al ingresar al laboratorio para registrar tu asistencia
            </p>
          </div>
          
          <div className="asistencias-container">
            <h4>Historial de asistencias</h4>
            <div className="asistencias-list">
              {asistencias.map((asistencia, index) => (
                <div key={index} className={`asistencia-item ${asistencia.estado.toLowerCase()}`}>
                  <div className="asistencia-estado">
                    <span className={`estado-badge ${asistencia.estado.toLowerCase()}`}>
                      {asistencia.estado}
                    </span>
                  </div>
                  <div className="asistencia-info">
                    <span className="asistencia-fecha">{asistencia.fecha}</span>
                    <span className="asistencia-materia">{asistencia.materia}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHorarios = () => (
    <div className="horarios-section">
      <h2>Mis Horarios</h2>
      <div className="horarios-grid">
        <div className="horario-card">
          <h3>Lunes</h3>
          <div className="clase-item">
            <strong>Programación Avanzada</strong>
            <span>08:00 - 10:00</span>
            <span>Lab. Computación 1</span>
            <span>Prof. Juan Pérez</span>
          </div>
          <div className="clase-item">
            <strong>Base de Datos</strong>
            <span>10:00 - 12:00</span>
            <span>Lab. Computación 2</span>
            <span>Prof. Ana García</span>
          </div>
        </div>
        
        <div className="horario-card">
          <h3>Martes</h3>
          <div className="clase-item">
            <strong>Redes de Computadoras</strong>
            <span>08:00 - 10:00</span>
            <span>Lab. Computación 3</span>
            <span>Prof. Carlos López</span>
          </div>
        </div>
        
        <div className="horario-card">
          <h3>Miércoles</h3>
          <div className="clase-item">
            <strong>Sistemas Operativos</strong>
            <span>14:00 - 16:00</span>
            <span>Lab. Computación 1</span>
            <span>Prof. María Rodríguez</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMaterias = () => (
    <div className="materias-section">
      <h2>Mis Materias</h2>
      <div className="materias-grid">
        <div className="materia-card">
          <h3>Programación Avanzada</h3>
          <p><strong>Profesor:</strong> Juan Pérez</p>
          <p><strong>Horario:</strong> Lunes 08:00-10:00</p>
          <p><strong>Laboratorio:</strong> Lab. Computación 1</p>
          <div className="materia-stats">
            <span>Asistencias: 12/15</span>
            <span>Promedio: 85%</span>
          </div>
        </div>
        
        <div className="materia-card">
          <h3>Base de Datos</h3>
          <p><strong>Profesor:</strong> Ana García</p>
          <p><strong>Horario:</strong> Lunes 10:00-12:00</p>
          <p><strong>Laboratorio:</strong> Lab. Computación 2</p>
          <div className="materia-stats">
            <span>Asistencias: 14/15</span>
            <span>Promedio: 92%</span>
          </div>
        </div>
        
        <div className="materia-card">
          <h3>Redes de Computadoras</h3>
          <p><strong>Profesor:</strong> Carlos López</p>
          <p><strong>Horario:</strong> Martes 08:00-10:00</p>
          <p><strong>Laboratorio:</strong> Lab. Computación 3</p>
          <div className="materia-stats">
            <span>Asistencias: 13/15</span>
            <span>Promedio: 88%</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPerfil = () => (
    <div className="perfil-section">
      <h2>Mi Perfil</h2>
      <div className="perfil-card">
        <div className="perfil-header">
          <div className="perfil-avatar">
            {userData?.nombre?.split(' ').map(n => n[0]).join('').toUpperCase() || 'BA'}
          </div>
          <div className="perfil-info">
            <h3>Brian Alexis Aquino Ovando</h3>
            <p className="matricula">Matrícula: Y200003</p>
            <p className="carrera">Ingeniería en Sistemas Computacionales</p>
          </div>
        </div>
        
        <div className="perfil-details">
          <div className="detail-group">
            <h4>Información Personal</h4>
            <p><strong>Email:</strong> brian.aquino@unach.mx</p>
            <p><strong>Teléfono:</strong> 961-123-4567</p>
            <p><strong>Grupo:</strong> 5°M</p>
          </div>
          
          <div className="detail-group">
            <h4>Estadísticas</h4>
            <p><strong>Asistencia General:</strong> 92%</p>
            <p><strong>Materias Inscritas:</strong> 6</p>
            <p><strong>Promedio General:</strong> 8.7</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeMenu) {
      case 'qr':
        return renderQR();
      case 'horarios':
        return renderHorarios();
      case 'materias':
        return renderMaterias();
      case 'perfil':
        return renderPerfil();
      default:
        return renderQR();
    }
  };

  return (
    <div className="dashboard-alumno">
      {/* Header */}
      <header className="alumno-header">
        <div className="header-left">
          <div className="logo">
            <span>UNACH</span>
          </div>
          <h1>Alumno SISLAB</h1>
        </div>
        <div className="header-right">
          <span className="user-info">usuario: {userData?.username || 'alumno'}</span>
          <button onClick={onLogout} className="logout-btn">Cerrar sesión</button>
        </div>
      </header>

      <div className="alumno-container">
        {/* Sidebar */}
        <aside className="alumno-sidebar">
          <nav className="sidebar-nav">
            <div 
              className={`nav-item ${activeMenu === 'qr' ? 'active' : ''}`}
              onClick={() => setActiveMenu('qr')}
            >
              📱 Mi QR y Asistencias
            </div>
            <div 
              className={`nav-item ${activeMenu === 'horarios' ? 'active' : ''}`}
              onClick={() => setActiveMenu('horarios')}
            >
              🕒 Mis Horarios
            </div>
            <div 
              className={`nav-item ${activeMenu === 'materias' ? 'active' : ''}`}
              onClick={() => setActiveMenu('materias')}
            >
              📚 Mis Materias
            </div>
            <div 
              className={`nav-item ${activeMenu === 'perfil' ? 'active' : ''}`}
              onClick={() => setActiveMenu('perfil')}
            >
              👤 Mi Perfil
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="alumno-main">
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

export default DashboardAlumno;