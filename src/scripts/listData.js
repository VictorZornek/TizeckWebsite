/* eslint-disable @typescript-eslint/no-require-imports */
const mongoose = require('mongoose');
require('dotenv').config();

// Schemas
const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  images: [String],
  activated: Boolean,
  specifications: mongoose.Schema.Types.Mixed,
});

const CategorySchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  activated: Boolean,
});

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
});

const Product = mongoose.model('Products', ProductSchema);
const Category = mongoose.model('Category', CategorySchema);
const User = mongoose.model('User', UserSchema);

async function listAllData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB\n');

    // Listar produtos
    const products = await Product.find({});
    console.log('📦 PRODUTOS CADASTRADOS:');
    console.log('========================');
    if (products.length === 0) {
      console.log('Nenhum produto encontrado\n');
    } else {
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name}`);
        console.log(`   Categoria: ${product.category}`);
        console.log(`   Descrição: ${product.description}`);
        console.log(`   Imagens: ${product.images?.length || 0}`);
        console.log(`   Ativo: ${product.activated}`);
        console.log(`   ID: ${product._id}\n`);
      });
    }

    // Listar categorias
    const categories = await Category.find({});
    console.log('📂 CATEGORIAS CADASTRADAS:');
    console.log('==========================');
    if (categories.length === 0) {
      console.log('Nenhuma categoria encontrada\n');
    } else {
      categories.forEach((category, index) => {
        console.log(`${index + 1}. ${category.name}`);
        console.log(`   Descrição: ${category.description}`);
        console.log(`   Imagem: ${category.image || 'Sem imagem'}`);
        console.log(`   Ativo: ${category.activated}`);
        console.log(`   ID: ${category._id}\n`);
      });
    }

    // Listar usuários
    const users = await User.find({});
    console.log('👤 USUÁRIOS CADASTRADOS:');
    console.log('========================');
    if (users.length === 0) {
      console.log('Nenhum usuário encontrado\n');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   ID: ${user._id}\n`);
      });
    }

    // Resumo
    console.log('📊 RESUMO:');
    console.log('==========');
    console.log(`Total de produtos: ${products.length}`);
    console.log(`Total de categorias: ${categories.length}`);
    console.log(`Total de usuários: ${users.length}`);

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Desconectado do MongoDB');
  }
}

listAllData();