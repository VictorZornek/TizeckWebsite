import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export default async function conectarMongo() {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION as string);
    console.log("✅ MongoDB conectado com sucesso.");
  } catch (erro) {
    console.error("❌ Erro ao conectar no MongoDB:", erro);
  }
}
