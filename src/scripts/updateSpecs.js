const mongoose = require('mongoose');
require('dotenv').config();

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  images: [String],
  activated: Boolean,
  specifications: mongoose.Schema.Types.Mixed,
});

const Product = mongoose.model('Products', ProductSchema);

async function updateSpecifications() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB\n');

    // Especificações para Suporte Quadrado
    const quadradoSpecs = {
      comprimento: "22cm",
      altura: "24cm",
      largura: "22cm",
      peso: "500g",
      material: "Plástico"
    };

    // Especificações para Suporte Redondo
    const redondoSpecs = {
      altura: "24cm",
      diâmetro: "24,5cm",
      peso: "500g",
      material: "Plástico"
    };

    // Atualizar produtos Suporte Quadrado
    const quadradoResult = await Product.updateMany(
      { category: "Suporte Quadrado" },
      { $set: { specifications: quadradoSpecs } }
    );

    console.log(`📦 Suporte Quadrado: ${quadradoResult.modifiedCount} produtos atualizados`);

    // Atualizar produtos Suporte Redondo
    const redondoResult = await Product.updateMany(
      { category: "Suporte Redondo" },
      { $set: { specifications: redondoSpecs } }
    );

    console.log(`🔵 Suporte Redondo: ${redondoResult.modifiedCount} produtos atualizados`);

    // Verificar produtos atualizados
    const updatedProducts = await Product.find({
      category: { $in: ["Suporte Quadrado", "Suporte Redondo"] }
    });

    console.log('\n✅ Produtos com especificações atualizadas:');
    console.log('==========================================');
    
    updatedProducts.forEach(product => {
      console.log(`${product.name} (${product.category})`);
      console.log(`Especificações:`, product.specifications);
      console.log('---');
    });

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Desconectado do MongoDB');
  }
}

updateSpecifications();