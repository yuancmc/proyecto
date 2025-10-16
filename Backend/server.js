require('dotenv').config();
const express = require('express');
const cors = require('cors');

const loginRoutes = require('./routes/loginRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', loginRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
