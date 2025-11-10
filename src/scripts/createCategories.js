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

const CategorySchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  activated: Boolean,
});

const Product = mongoose.model('Products', ProductSchema);
const Category = mongoose.model('Category', CategorySchema);

async function createCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado ao MongoDB\n');

    // Buscar categorias únicas dos produtos
    const uniqueCategories = await Product.distinct("category");
    console.log('📦 Categorias encontradas nos produtos:', uniqueCategories);

    // Definir descrições para cada categoria
    const categoryDescriptions = {
      "Suporte Quadrado": "Suportes com formato quadrado, ideais para diversos tipos de instalação",
      "Suporte Redondo": "Suportes com formato redondo, perfeitos para aplicações circulares",
      "Suporte Master": "Linha premium de suportes com diferentes materiais e acabamentos",
      "Suporte MAX": "Suportes de alta resistência para aplicações pesadas",
      "Bomba": "Bombas e sistemas de bombeamento para diversas aplicações",
      "Torneira": "Torneiras em diferentes tamanhos e cores para uso residencial e comercial"
    };

    // Criar categorias
    for (const categoryName of uniqueCategories) {
      const existingCategory = await Category.findOne({ name: categoryName });
      
      if (!existingCategory) {
        const category = new Category({
          name: categoryName,
          description: categoryDescriptions[categoryName] || `Produtos da linha ${categoryName}`,
          image: "",
          activated: true
        });

        await category.save();
        console.log(`✅ Categoria criada: ${categoryName}`);
      } else {
        console.log(`⚠️  Categoria já existe: ${categoryName}`);
      }
    }

    // Verificar categorias criadas
    const categories = await Category.find({});
    console.log('\n📂 CATEGORIAS CADASTRADAS:');
    console.log('==========================');
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name}`);
      console.log(`   Descrição: ${category.description}`);
      console.log(`   Ativo: ${category.activated}\n`);
    });

  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Desconectado do MongoDB');
  }
}

createCategories();