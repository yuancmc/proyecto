const pool = require('../db');

const loginUser = async (req, res) => {
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

    // Buscar usuario en la tabla usuarios
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

    // Datos extra según el rol
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
    if (client) client.release();
  }
};

module.exports = { loginUser };
