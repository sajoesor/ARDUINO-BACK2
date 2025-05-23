const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Error de conexión a MongoDB:', err));

// Esquema de botón
const registroSchema = new mongoose.Schema({
  boton: String,
  hora: String
});

const Registro = mongoose.model('Registro', registroSchema);

// POST /registro – recibe botón desde Arduino
app.post('/registro', async (req, res) => {
  const { boton } = req.body;

  if (!['arriba', 'abajo', 'izquierda', 'derecha'].includes(boton)) {
    return res.status(400).json({ error: 'Botón inválido' });
  }

  const hora = new Date().toLocaleString();

  const nuevoRegistro = new Registro({ boton, hora });
  await nuevoRegistro.save();

  res.status(201).json({ message: 'Registro guardado correctamente' });
});

// GET /registros – consulta todos los registros
app.get('/registros', async (req, res) => {
  const registros = await Registro.find({}, { __v: 0 });
  res.json(registros);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
