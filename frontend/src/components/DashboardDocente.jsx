import React, { useState, useEffect } from 'react';
import '../App.css';

const DashboardDocente = ({ userData, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('horarios');
  const [laboratorios, setLaboratorios] = useState([]);
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    // Datos de ejemplo
    setLaboratorios([
      { 
        id_laboratorio: 1, 
        nombre: 'Laboratorio 1', 
        horario: '16:00 - 17:00',
        materia: 'Programación Avanzada',
        grupo: '5°M'
      },
      { 
        id_laboratorio: 2, 
        nombre: 'Laboratorio 2', 
        horario: '16:00 - 17:00',
        materia: 'Base de Datos',
        grupo: '3°K'
      },
      { 
        id_laboratorio: 3, 
        nombre: 'Laboratorio 3', 
        horario: '16:00 - 17:00',
        materia: 'Redes de Computadoras',
        grupo: '4°L'
      },
      { 
        id_laboratorio: 4, 
        nombre: 'Laboratorio 4', 
        horario: '16:00 - 17:00',
        materia: 'Sistemas Operativos',
        grupo: '2°J'
      }
    ]);

    setAsistencias([
      { fecha: '21/09/2024', laboratorio: 'Lab. 1', presentes: 25, ausentes: 2 },
      { fecha: '20/09/2024', laboratorio: 'Lab. 2', presentes: 22, ausentes: 3 },
      { fecha: '19/09/2024', laboratorio: 'Lab. 3', presentes: 28, ausentes: 1 },
      { fecha: '18/09/2024', laboratorio: 'Lab. 1', presentes: 24, ausentes: 3 }
    ]);
  }, []);

  const metricsData = [
    { title: 'Clases Hoy', value: '4', icon: '📚' },
    { title: 'Estudiantes Total', value: '120', icon: '🎓' },
    { title: 'Asistencia Promedio', value: '92%', icon: '✅' },
    { title: 'Laboratorios', value: '4', icon: '🖥️' }
  ];

  const renderHorarios = () => (
    <div className="horarios-docente-section">
      <div className="section-header">
        <h2>Mis horarios</h2>
        <div className="header-actions">
          <span className="fecha-actual">Fecha: {new Date().toLocaleDateString('es-ES')}</span>
          <button className="export-btn">Exportar reporte mensual</button>
        </div>
      </div>

      <div className="laboratorios-grid">
        {laboratorios.map(lab => (
          <div key={lab.id_laboratorio} className="laboratorio-card-docente">
            <h3>{lab.nombre}</h3>
            <div className="lab-info-docente">
              <p><strong>Materia:</strong> {lab.materia}</p>
              <p><strong>Grupo:</strong> {lab.grupo}</p>
              <p><strong>Horario:</strong> {lab.horario}</p>
            </div>
            <button className="ver-asistencia-btn">Ver asistencia</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAsistencias = () => (
    <div className="asistencias-section">
      <h2>Gestión de Asistencias</h2>
      <div className="asistencias-grid">
        {laboratorios.map(lab => (
          <div key={lab.id_laboratorio} className="asistencia-card">
            <h3>{lab.nombre} - {lab.materia}</h3>
            <div className="asistencia-info">
              <p><strong>Grupo:</strong> {lab.grupo}</p>
              <p><strong>Horario:</strong> {lab.horario}</p>
              <p><strong>Estudiantes:</strong> 30</p>
            </div>
            <div className="asistencia-actions">
              <button className="btn-tomar-asistencia">Tomar Asistencia</button>
              <button className="btn-ver-historial">Ver Historial</button>
            </div>
          </div>
        ))}
      </div>

      <div className="historial-asistencias">
        <h3>Historial Reciente</h3>
        <div className="asistencias-table">
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Laboratorio</th>
                <th>Presentes</th>
                <th>Ausentes</th>
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              {asistencias.map((asistencia, index) => (
                <tr key={index}>
                  <td>{asistencia.fecha}</td>
                  <td>{asistencia.laboratorio}</td>
                  <td>{asistencia.presentes}</td>
                  <td>{asistencia.ausentes}</td>
                  <td>
                    <span className={`porcentaje ${((asistencia.presentes / (asistencia.presentes + asistencia.ausentes)) * 100) > 80 ? 'alto' : 'bajo'}`}>
                      {((asistencia.presentes / (asistencia.presentes + asistencia.ausentes)) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderMaterial = () => (
    <div className="material-section">
      <h2>Material Didáctico</h2>
      <div className="material-actions">
        <div className="upload-card">
          <h3>Subir Nuevo Material</h3>
          <div className="upload-area">
            <span>📁 Arrastra archivos aquí o</span>
            <button className="btn-select-files">Seleccionar archivos</button>
          </div>
          <div className="file-types">
            <span>Formatos permitidos: PDF, PPT, DOC, ZIP</span>
          </div>
        </div>

        <div className="material-list">
          <h3>Material Subido</h3>
          <div className="material-items">
            <div className="material-item">
              <div className="material-icon">📄</div>
              <div className="material-info">
                <strong>Guía Programación.pdf</strong>
                <span>Subido: 20/09/2024</span>
                <span>Laboratorio 1 - 5°M</span>
              </div>
              <div className="material-actions">
                <button className="btn-descargar">Descargar</button>
                <button className="btn-eliminar">Eliminar</button>
              </div>
            </div>

            <div className="material-item">
              <div className="material-icon">📊</div>
              <div className="material-info">
                <strong>Presentación BD.ppt</strong>
                <span>Subido: 18/09/2024</span>
                <span>Laboratorio 2 - 3°K</span>
              </div>
              <div className="material-actions">
                <button className="btn-descargar">Descargar</button>
                <button className="btn-eliminar">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReportes = () => (
    <div className="reportes-docente-section">
      <h2>Reportes y Estadísticas</h2>
      <div className="reportes-grid">
        <div className="reporte-card">
          <h3>Reporte de Asistencias</h3>
          <p>Genera reportes detallados de asistencias por periodo</p>
          <div className="reporte-options">
            <select className="periodo-select">
              <option>Semanal</option>
              <option>Mensual</option>
              <option>Semestral</option>
            </select>
            <button className="btn-generar-reporte">Generar Reporte</button>
          </div>
        </div>

        <div className="reporte-card">
          <h3>Estadísticas de Grupo</h3>
          <div className="estadisticas-list">
            <div className="estadistica-item">
              <span>5°M - Programación</span>
              <span className="estadistica-valor">88%</span>
            </div>
            <div className="estadistica-item">
              <span>3°K - Base de Datos</span>
              <span className="estadistica-valor">92%</span>
            </div>
            <div className="estadistica-item">
              <span>4°L - Redes</span>
              <span className="estadistica-valor">85%</span>
            </div>
          </div>
        </div>

        <div className="reporte-card">
          <h3>Exportar Datos</h3>
          <p>Exporta información en diferentes formatos</p>
          <div className="export-options">
            <button className="btn-export">📊 Excel</button>
            <button className="btn-export">📄 PDF</button>
            <button className="btn-export">📋 CSV</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeMenu) {
      case 'horarios':
        return renderHorarios();
      case 'asistencias':
        return renderAsistencias();
      case 'material':
        return renderMaterial();
      case 'reportes':
        return renderReportes();
      default:
        return renderHorarios();
    }
  };

  return (
    <div className="dashboard-docente">
      {/* Header */}
      <header className="docente-header">
        <div className="header-left">
          <div className="logo">
            <span>UNACH</span>
          </div>
          <h1>Docente SISLAB</h1>
        </div>
        <div className="header-right">
          <span className="user-info">usuario: {userData?.username || 'docente'}</span>
          <button onClick={onLogout} className="logout-btn">Cerrar sesión</button>
        </div>
      </header>

      <div className="docente-container">
        {/* Sidebar */}
        <aside className="docente-sidebar">
          <nav className="sidebar-nav">
            <div 
              className={`nav-item ${activeMenu === 'horarios' ? 'active' : ''}`}
              onClick={() => setActiveMenu('horarios')}
            >
              🕒 Mis horarios
            </div>
            <div 
              className={`nav-item ${activeMenu === 'asistencias' ? 'active' : ''}`}
              onClick={() => setActiveMenu('asistencias')}
            >
              ✅ Gestión de asistencias
            </div>
            <div 
              className={`nav-item ${activeMenu === 'material' ? 'active' : ''}`}
              onClick={() => setActiveMenu('material')}
            >
              📚 Material didáctico
            </div>
            <div 
              className={`nav-item ${activeMenu === 'reportes' ? 'active' : ''}`}
              onClick={() => setActiveMenu('reportes')}
            >
              📊 Reportes y estadísticas
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="docente-main">
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

export default DashboardDocente;