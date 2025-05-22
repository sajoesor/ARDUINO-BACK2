const express = require("express");
const mongoose = require("mongoose");
const serverless = require("serverless-http");
require("dotenv").config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const registroSchema = new mongoose.Schema({
  boton: String,
  hora: String,
});
const Registro = mongoose.model("Registro", registroSchema);

// POST /api/registro
app.post("/", async (req, res) => {
  const { boton } = req.body;
  if (!["arriba", "abajo", "izquierda", "derecha"].includes(boton)) {
    return res.status(400).json({ error: "Botón inválido" });
  }
  const hora = new Date().toLocaleString();
  const nuevoRegistro = new Registro({ boton, hora });
  await nuevoRegistro.save();
  res.status(201).json({ message: "Registro guardado correctamente" });
});

// GET /api/registro
app.get("/", async (req, res) => {
  const registros = await Registro.find({}, { __v: 0 });
  res.json(registros);
});

module.exports = serverless(app);