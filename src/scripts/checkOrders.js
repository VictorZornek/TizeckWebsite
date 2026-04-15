require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI;

async function checkOrders() {
  try {
    console.log('Conectando ao MongoDB...\n');
    await mongoose.connect(MONGODB_URI);

    const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false }));
    const Products = mongoose.model('Products', new mongoose.Schema({}, { strict: false }));

    // Verificar um pedido específico
    const order = await Order.findOne({ legacyId: 15746 }).lean();
    
    console.log('=== PEDIDO #15746 ===\n');
    console.log('Total de itens no array:', order?.items?.length || 0);
    
    if (order?.items && order.items.length > 0) {
      console.log('\nItens do pedido:');
      order.items.forEach((item, index) => {
        console.log(`\n  Item ${index + 1}:`);
        console.log(`    Produto: ${item.productName}`);
        console.log(`    Código Legado: ${item.legacyProductCode}`);
        console.log(`    Quantidade: ${item.quantity}`);
        console.log(`    Valor Unit: R$ ${item.unitPrice}`);
        console.log(`    Total: R$ ${item.totalPrice}`);
      });
    } else {
      console.log('\n⚠️  Nenhum item encontrado no pedido!');
    }

    // Verificar produtos
    console.log('\n\n=== PRODUTOS ===\n');
    const totalProducts = await Products.countDocuments();
    console.log(`Total de produtos no MongoDB: ${totalProducts}`);
    
    if (totalProducts > 0) {
      const sampleProduct = await Products.findOne().lean();
      console.log('\nExemplo de produto:');
      console.log(`  Nome: ${sampleProduct.name}`);
      console.log(`  Legacy ID: ${sampleProduct.specifications?.legacyId}`);
    }

    // Verificar pedidos sem itens
    const ordersWithoutItems = await Order.countDocuments({ 
      $or: [
        { items: { $exists: false } },
        { items: { $size: 0 } }
      ]
    });
    
    console.log(`\n\n⚠️  Pedidos sem itens: ${ordersWithoutItems}`);

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

checkOrders();
