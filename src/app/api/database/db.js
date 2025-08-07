const mongoose = require("mongoose");
require("dotenv").config();

async function conectarMongo() {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION);

    console.log("✅ MongoDB conectado com sucesso.");
    
  } catch (erro) {
    console.error("❌ Erro ao conectar no MongoDB:", erro);
  }
}

module.exports = conectarMongo;