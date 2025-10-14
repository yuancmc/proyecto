const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'SISLAB',
  password: 'Sayu12345',
  port: 5432,
});

async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a PostgreSQL exitosa!');
    
    // Verificar si la tabla usuarios existe
    const tableCheck = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'usuarios'
    `);
    
    if (tableCheck.rows.length === 0) {
      console.log('❌ La tabla "usuarios" no existe');
    } else {
      console.log('✅ Tabla "usuarios" encontrada');
      
      // Verificar las columnas de la tabla
      const columnsCheck = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'usuarios'
      `);
      
      console.log('📊 Columnas de la tabla usuarios:');
      columnsCheck.rows.forEach(col => {
        console.log(`   - ${col.column_name} (${col.data_type})`);
      });
      
      // Verificar los datos
      const dataCheck = await client.query('SELECT * FROM usuarios');
      console.log('👤 Usuarios en la base de datos:');
      dataCheck.rows.forEach(user => {
        console.log(`   - ${user.username} / ${user.password} (${user.rol})`);
      });
    }
    
    client.release();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    process.exit(1);
  }
}

testConnection();