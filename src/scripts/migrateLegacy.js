require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_URI_LEGACY = MONGODB_URI.replace(/\/[^\/]*$/, '/tizeck-legacy');

async function migrateLegacyData() {
  try {
    console.log('========================================');
    console.log('MIGRAÇÃO PARA BANCO SEPARADO');
    console.log('========================================\n');
    
    // Conectar aos dois bancos
    console.log('Conectando ao banco principal...');
    const mainConn = await mongoose.createConnection(MONGODB_URI).asPromise();
    console.log('✅ Conectado ao banco principal\n');
    
    console.log('Conectando ao banco legacy...');
    const legacyConn = await mongoose.createConnection(MONGODB_URI_LEGACY).asPromise();
    console.log('✅ Conectado ao banco legacy\n');

    // Definir schemas
    const schema = new mongoose.Schema({}, { strict: false });
    
    const MainCustomer = mainConn.model('Customer', schema);
    const MainOrder = mainConn.model('Order', schema);
    const MainProducts = mainConn.model('Products', schema);
    const MainImportHistory = mainConn.model('ImportHistory', schema);
    
    const LegacyCustomer = legacyConn.model('Customer', schema);
    const LegacyOrder = legacyConn.model('Order', schema);
    const LegacyProduct = legacyConn.model('LegacyProduct', schema);
    const LegacyImportHistory = legacyConn.model('ImportHistory', schema);

    // 1. Migrar Clientes
    console.log('📦 Migrando clientes...');
    const customers = await MainCustomer.find({}).lean();
    if (customers.length > 0) {
      await LegacyCustomer.insertMany(customers);
      console.log(`✅ ${customers.length} clientes migrados`);
    } else {
      console.log('⚠️  Nenhum cliente para migrar');
    }

    // 2. Migrar Pedidos
    console.log('\n📦 Migrando pedidos...');
    const orders = await MainOrder.find({}).lean();
    if (orders.length > 0) {
      await LegacyOrder.insertMany(orders);
      console.log(`✅ ${orders.length} pedidos migrados`);
    } else {
      console.log('⚠️  Nenhum pedido para migrar');
    }

    // 3. Migrar apenas produtos IMPORTADOS (categoria diferente das do site)
    console.log('\n📦 Migrando produtos importados...');
    const siteCategories = [
      'Suporte Redondo', 'Suporte Quadrado', 'Suporte Master', 
      'Suporte MAX', 'Torneira', 'Bomba'
    ];
    
    const importedProducts = await MainProducts.find({ 
      category: { $nin: siteCategories }
    }).lean();
    
    if (importedProducts.length > 0) {
      await LegacyProduct.insertMany(importedProducts);
      console.log(`✅ ${importedProducts.length} produtos importados migrados`);
    } else {
      console.log('⚠️  Nenhum produto importado para migrar');
    }

    // 4. Migrar histórico de importações
    console.log('\n📦 Migrando histórico de importações...');
    const history = await MainImportHistory.find({}).lean();
    if (history.length > 0) {
      await LegacyImportHistory.insertMany(history);
      console.log(`✅ ${history.length} registros de histórico migrados`);
    } else {
      console.log('⚠️  Nenhum histórico para migrar');
    }

    // 5. Limpar dados do banco principal
    console.log('\n🧹 Limpando dados importados do banco principal...');
    
    const customersDeleted = await MainCustomer.deleteMany({});
    console.log(`✅ ${customersDeleted.deletedCount} clientes removidos`);
    
    const ordersDeleted = await MainOrder.deleteMany({});
    console.log(`✅ ${ordersDeleted.deletedCount} pedidos removidos`);
    
    const importedProductsDeleted = await MainProducts.deleteMany({ 
      category: { $nin: siteCategories }
    });
    console.log(`✅ ${importedProductsDeleted.deletedCount} produtos importados removidos`);
    
    const historyDeleted = await MainImportHistory.deleteMany({});
    console.log(`✅ ${historyDeleted.deletedCount} registros de histórico removidos`);

    // Verificar produtos restantes
    const remainingProducts = await MainProducts.countDocuments();
    console.log(`\n📊 Produtos do site mantidos: ${remainingProducts}`);

    console.log('\n========================================');
    console.log('✅ MIGRAÇÃO CONCLUÍDA COM SUCESSO!');
    console.log('========================================');
    console.log('\nBanco principal: Produtos do site');
    console.log('Banco legacy: Clientes, Pedidos, Produtos importados\n');

    await mainConn.close();
    await legacyConn.close();
  } catch (error) {
    console.error('\n❌ Erro na migração:', error);
  }
}

migrateLegacyData();
