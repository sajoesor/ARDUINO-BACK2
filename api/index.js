const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Crear instancia de Express
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  throw new Error('Falta la variable de entorno MONGO_URI');
}

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Definir esquema de Mongo
const registroSchema = new mongoose.Schema({
  boton: String,
  hora: String
});

const Registro = mongoose.model('Registro', registroSchema);

// Ruta POST /api/registro
app.post('/api/registro', async (req, res) => {
  const { boton } = req.body;

  if (!['arriba', 'abajo', 'izquierda', 'derecha'].includes(boton)) {
    return res.status(400).json({ error: 'Botón inválido' });
  }

  const hora = new Date().toLocaleString();

  const nuevoRegistro = new Registro({ boton, hora });
  await nuevoRegistro.save();

  res.status(201).json({ message: 'Registro guardado correctamente' });
});

// Ruta GET /api/registros
app.get('/api/registros', async (req, res) => {
  const registros = await Registro.find({}, { __v: 0 });
  res.json(registros);
});

// Exportar app para que Vercel lo use como handler
module.exports = app;
