require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function analyzeProducts() {
  try {
    console.log('========================================');
    console.log('ANÁLISE DE PRODUTOS');
    console.log('========================================\n');
    
    await mongoose.connect(MONGODB_URI);
    
    const Products = mongoose.model('Products', new mongoose.Schema({}, { strict: false }));
    
    // Produtos do SITE (sem legacyId OU com categorias específicas do site)
    const siteCategories = [
      'Suporte Redondo', 'Suporte Quadrado', 'Suporte Master', 
      'Suporte MAX', 'Torneira', 'Bomba'
    ];
    
    const siteProducts = await Products.find({ 
      category: { $in: siteCategories }
    }).lean();
    
    // Produtos IMPORTADOS (categoria "Importados" ou sem categoria do site)
    const importedProducts = await Products.find({ 
      category: { $nin: siteCategories }
    }).lean();
    
    console.log('📊 RESUMO:\n');
    console.log(`✅ Produtos do SITE (serão mantidos): ${siteProducts.length}`);
    console.log(`📦 Produtos IMPORTADOS (serão movidos): ${importedProducts.length}`);
    console.log(`📈 Total: ${siteProducts.length + importedProducts.length}\n`);
    
    if (siteProducts.length > 0) {
      console.log('========================================');
      console.log('PRODUTOS DO SITE (NÃO SERÃO TOCADOS):');
      console.log('========================================\n');
      
      siteProducts.forEach((p, i) => {
        console.log(`${i + 1}. ${p.name}`);
        console.log(`   Categoria: ${p.category}`);
        console.log(`   Imagens: ${p.images?.length || 0}`);
        console.log(`   Ativo: ${p.activated}`);
        console.log(`   Data: ${p.createdAt || 'N/A'}`);
        console.log('');
      });
    }
    
    if (importedProducts.length > 0) {
      console.log('========================================');
      console.log('PRODUTOS IMPORTADOS (SERÃO MOVIDOS):');
      console.log('========================================\n');
      
      importedProducts.slice(0, 10).forEach((p, i) => {
        console.log(`${i + 1}. ${p.name}`);
        console.log(`   Legacy ID: ${p.specifications?.legacyId}`);
        console.log(`   Categoria: ${p.category}`);
        console.log('');
      });
      
      if (importedProducts.length > 10) {
        console.log(`... e mais ${importedProducts.length - 10} produtos importados\n`);
      }
    }
    
    console.log('========================================');
    console.log('VERIFICAÇÃO DE SEGURANÇA:');
    console.log('========================================\n');
    
    // Verificar se algum produto do site foi marcado incorretamente
    const conflictCheck = await Products.find({ 
      category: { $in: siteCategories },
      $or: [
        { 'specifications.legacyId': { $exists: true, $ne: null } },
        { name: { $regex: /^Z-/, $options: 'i' } }
      ]
    }).lean();
    
    if (conflictCheck.length > 0) {
      console.log('⚠️  ATENÇÃO! Encontrados possíveis conflitos:');
      conflictCheck.forEach(p => {
        console.log(`   - ${p.name} (Categoria: ${p.category})`);
      });
      console.log('\n❌ MIGRAÇÃO CANCELADA POR SEGURANÇA!');
      console.log('   Esses produtos precisam de revisão manual.\n');
    } else {
      console.log('✅ Nenhum conflito detectado!');
      console.log('✅ Seguro para prosseguir com a migração.\n');
      console.log('Execute: npm run migrate-legacy\n');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

analyzeProducts();
