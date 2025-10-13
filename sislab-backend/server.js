const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'SISLAB',
  password: 'Camila12!',
  port: 5432,
});

// Verificar conexión a la base de datos
pool.on('connect', () => {
  console.log('✅ Conectado a la base de datos PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error de conexión a la base de datos:', err);
});

// Ruta de login MEJORADA
app.post('/api/login', async (req, res) => {
  let client;
  try {
    const { username, password } = req.body;

    console.log('🔐 Intento de login:', username);

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Usuario y contraseña son requeridos'
      });
    }

    client = await pool.connect();

    // Consulta para obtener usuario básico
    const userQuery = `
      SELECT id_usuario, username, password, rol 
      FROM usuarios 
      WHERE username = $1 AND password = $2
    `;
    
    const userResult = await client.query(userQuery, [username, password]);
    
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Usuario o contraseña incorrectos'
      });
    }

    const user = userResult.rows[0];
    let userInfo = { id_usuario: user.id_usuario };

    // Obtener información adicional según el rol
    if (user.rol === 'docente') {
      const docenteQuery = `
        SELECT id_docente, nombre, no_empleado 
        FROM docentes 
        WHERE id_usuario = $1
      `;
      const docenteResult = await client.query(docenteQuery, [user.id_usuario]);
      if (docenteResult.rows.length > 0) {
        userInfo = { ...userInfo, ...docenteResult.rows[0] };
      }
    } else if (user.rol === 'alumno') {
      const alumnoQuery = `
        SELECT a.id_alumno, a.nombre, a.matricula, g.nombre as grupo
        FROM alumnos a 
        LEFT JOIN grupos g ON a.id_grupo = g.id_grupo
        WHERE a.id_usuario = $1
      `;
      const alumnoResult = await client.query(alumnoQuery, [user.id_usuario]);
      if (alumnoResult.rows.length > 0) {
        userInfo = { ...userInfo, ...alumnoResult.rows[0] };
      }
    }

    console.log('✅ Login exitoso para:', username);
    
    res.json({
      success: true,
      message: 'Login exitoso',
      user: {
        username: user.username,
        rol: user.rol,
        info: userInfo
      }
    });

  } catch (error) {
    console.error('💥 Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor: ' + error.message
    });
  } finally {
    if (client) {
      client.release();
    }
  }
});

// RUTAS PARA ADMIN
app.get('/api/admin/laboratorios', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM laboratorios ORDER BY id_laboratorio');
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo laboratorios:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/usuarios-detalle', async (req, res) => {
  try {
    const client = await pool.connect();
    const query = `
      SELECT 
        u.id_usuario,
        u.username,
        u.rol,
        COALESCE(d.nombre, a.nombre, 'Administrador') as nombre,
        d.no_empleado,
        a.matricula,
        g.nombre as grupo
      FROM usuarios u
      LEFT JOIN docentes d ON u.id_usuario = d.id_usuario
      LEFT JOIN alumnos a ON u.id_usuario = a.id_usuario
      LEFT JOIN grupos g ON a.id_grupo = g.id_grupo
      ORDER BY u.id_usuario
    `;
    const result = await client.query(query);
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/admin/asistencias-hoy', async (req, res) => {
  try {
    const client = await pool.connect();
    const today = new Date().toISOString().split('T')[0];
    const query = `
      SELECT COUNT(*) as count 
      FROM asistencias a 
      JOIN clases c ON a.id_clase = c.id_clase 
      WHERE c.fecha = $1
    `;
    const result = await client.query(query, [today]);
    client.release();
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo asistencias:', error);
    res.status(500).json({ count: 0 });
  }
});

app.get('/api/admin/horarios-hoy', async (req, res) => {
  try {
    const client = await pool.connect();
    const today = new Date().toISOString().split('T')[0];
    const query = 'SELECT COUNT(*) as count FROM clases WHERE fecha = $1';
    const result = await client.query(query, [today]);
    client.release();
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo horarios:', error);
    res.status(500).json({ count: 0 });
  }
});

// RUTAS PARA DOCENTE
app.get('/api/docente/horarios/:idDocente', async (req, res) => {
  try {
    const { idDocente } = req.params;
    const client = await pool.connect();
    const query = `
      SELECT 
        c.id_clase,
        m.nombre as materia,
        l.nombre as laboratorio,
        g.nombre as grupo,
        c.fecha,
        c.hora_inicio,
        c.hora_fin
      FROM clases c
      JOIN materias_docentes_grupos mdg ON c.id_mdg = mdg.id_mdg
      JOIN materias m ON mdg.id_materia = m.id_materia
      JOIN laboratorios l ON c.id_laboratorio = l.id_laboratorio
      JOIN grupos g ON mdg.id_grupo = g.id_grupo
      WHERE mdg.id_docente = $1
      ORDER BY c.fecha, c.hora_inicio
    `;
    const result = await client.query(query, [idDocente]);
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo horarios docente:', error);
    res.status(500).json([]);
  }
});

// RUTAS PARA ALUMNO
app.get('/api/alumno/horarios/:idAlumno', async (req, res) => {
  try {
    const { idAlumno } = req.params;
    const client = await pool.connect();
    const query = `
      SELECT 
        c.id_clase,
        m.nombre as materia,
        d.nombre as profesor,
        l.nombre as laboratorio,
        c.fecha,
        c.hora_inicio,
        c.hora_fin
      FROM clases c
      JOIN materias_docentes_grupos mdg ON c.id_mdg = mdg.id_mdg
      JOIN materias m ON mdg.id_materia = m.id_materia
      JOIN docentes d ON mdg.id_docente = d.id_docente
      JOIN laboratorios l ON c.id_laboratorio = l.id_laboratorio
      JOIN alumnos a ON mdg.id_grupo = a.id_grupo
      WHERE a.id_alumno = $1
      ORDER BY c.fecha, c.hora_inicio
    `;
    const result = await client.query(query, [idAlumno]);
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo horarios alumno:', error);
    res.status(500).json([]);
  }
});

// RUTA GENERAL PARA LABORATORIOS
app.get('/api/laboratorios', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM laboratorios ORDER BY id_laboratorio');
    client.release();
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo laboratorios:', error);
    res.status(500).json([]);
  }
});

// Ruta para verificar estado del servidor y BD
app.get('/api/status', async (req, res) => {
  try {
    const client = await pool.connect();
    const dbResult = await client.query('SELECT NOW() as time, version() as version');
    client.release();
    
    res.json({
      server: '✅ En línea',
      database: '✅ Conectado',
      timestamp: dbResult.rows[0].time,
      version: dbResult.rows[0].version
    });
  } catch (error) {
    res.json({
      server: '✅ En línea',
      database: '❌ Desconectado',
      error: error.message
    });
  }
});

// Ruta GET para testing
app.get('/api/login', (req, res) => {
  res.json({
    message: 'Usa POST para hacer login',
    ejemplo: {
      username: 'docente01',
      password: 'docente123'
    },
    endpoint: 'POST /api/login'
  });
});

// Ruta de prueba
app.get('/api', (req, res) => {
  res.json({
    message: '✅ Servidor funcionando',
    rutas: {
      status: 'GET /api/status',
      login: 'POST /api/login',
      admin: {
        laboratorios: 'GET /api/admin/laboratorios',
        usuarios: 'GET /api/admin/usuarios-detalle',
        asistencias: 'GET /api/admin/asistencias-hoy',
        horarios: 'GET /api/admin/horarios-hoy'
      },
      docente: {
        horarios: 'GET /api/docente/horarios/:id'
      },
      alumno: {
        horarios: 'GET /api/alumno/horarios/:id'
      }
    }
  });
});

// Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend en: http://localhost:${PORT}`);
  console.log(`📊 Verificar estado: http://localhost:${PORT}/api/status`);
  console.log(`🔐 Ruta de login: http://localhost:${PORT}/api/login`);
});