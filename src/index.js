/**
 * Entry point - Inicializa el servidor Express y monta rutas de autenticación
 */

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/auth', authRoutes);

// Ruta simple para verificar estado del servicio
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Servicio de autenticación MULTISORE activo' });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Auth service running on http://localhost:${PORT}`);
});
