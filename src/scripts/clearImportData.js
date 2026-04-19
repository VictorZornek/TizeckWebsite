require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function clearImportedData() {
  try {
    console.log('Conectando ao MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Conectado!\n');

    const Customer = mongoose.model('Customer', new mongoose.Schema({}, { strict: false }));
    const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
    const ImportHistory = mongoose.model('ImportHistory', new mongoose.Schema({}, { strict: false }));

    console.log('Limpando dados importados...\n');

    const customersDeleted = await Customer.deleteMany({});
    console.log(`✅ ${customersDeleted.deletedCount} clientes removidos`);

    const ordersDeleted = await Order.deleteMany({});
    console.log(`✅ ${ordersDeleted.deletedCount} pedidos removidos`);

    const historyDeleted = await ImportHistory.deleteMany({});
    console.log(`✅ ${historyDeleted.deletedCount} registros de histórico removidos`);

    console.log('\n🎉 Dados limpos! Agora você pode testar a importação novamente.');
    console.log('   Acesse: http://localhost:3000/admin/import\n');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

clearImportedData();
