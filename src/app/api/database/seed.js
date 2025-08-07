const mongoose = require("mongoose");
require("dotenv").config();
const Product = require("./models/Product");

const MONGO_CONNECTION = process.env.MONGO_CONNECTION;

const categorias = [
  "Filtro",
  "Suporte Quadrado",
  "Suporte Redondo",
  "Torneira",
  "Galões"
];

const gerarProdutosExemplo = () => {
  const produtos = [];

  categorias.forEach((categoria) => {
    for (let i = 1; i <= 3; i++) {
      produtos.push({
        name: `${categoria} Modelo ${i}`,
        description: `Descrição do produto ${i} da categoria ${categoria}.`,
        category: categoria,
        images: [],
        activated: true,
        specifications: {}
      });
    }
  });

  return produtos;
};

async function popularBanco() {
  try {
    await mongoose.connect(MONGO_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ Conectado ao MongoDB.");

    const produtos = gerarProdutosExemplo();

    await Product.insertMany(produtos);
    console.log("🎉 Produtos inseridos com sucesso!");

    await mongoose.disconnect();
    console.log("🔌 Conexão encerrada.");
  } catch (err) {
    console.error("❌ Erro ao popular banco:", err);
  }
}

async function listarProdutos() {
  try {
    await mongoose.connect(MONGO_CONNECTION);
    console.log("✅ Conectado ao MongoDB.");

    const produtos = await Product.find();

    console.log("📦 Produtos encontrados:");
    produtos.forEach((produto, index) => {
      console.log(`\n${index + 1}. ${produto.name} (${produto.category})`);
      console.log(`   Descrição: ${produto.description}`);
    });

    await mongoose.disconnect();
    console.log("\n🔌 Conexão encerrada.");
  } catch (err) {
    console.error("❌ Erro ao buscar produtos:", err);
  }
}

listarProdutos();