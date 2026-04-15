import Firebird from "node-firebird";
import Customer from "../models/Customer";
import Order from "../models/Order";
import Products from "../models/Product";
import ImportHistory from "../models/ImportHistory";

interface FirebirdOptions {
  database: string;
  user: string;
  password: string;
}

export class FirebirdImportService {
  private options: FirebirdOptions;
  private logs: string[] = [];
  private lastSyncDate: Date | null = null;

  constructor(dbPath: string) {
    this.options = {
      database: dbPath,
      user: "SYSDBA",
      password: "masterkey",
    };
  }

  private log(message: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}`;
    this.logs.push(logMessage);
    console.log(logMessage);
  }

  getLogs() {
    return this.logs;
  }

  private async query<T>(sql: string): Promise<T[]> {
    return new Promise((resolve, reject) => {
      Firebird.attach(this.options, (err, db) => {
        if (err) return reject(err);
        
        db.query(sql, [], (err, result) => {
          db.detach();
          if (err) return reject(err);
          resolve(result as T[]);
        });
      });
    });
  }

  async importCustomers() {
    const stats = { imported: 0, errors: 0, new: 0, updated: 0 };
    const errors: string[] = [];

    try {
      this.log('Iniciando importação de clientes...');
      const customers = await this.query<any>("SELECT * FROM CLIENTES");
      this.log(`Encontrados ${customers.length} clientes no banco Firebird`);
      
      // Buscar IDs existentes no MongoDB
      const existingIds = new Set(
        (await Customer.find({}, { legacyId: 1 }).lean()).map(c => c.legacyId)
      );
      this.log(`${existingIds.size} clientes já existem no MongoDB`);
      
      // Processar em lotes de 100
      const BATCH_SIZE = 100;
      for (let i = 0; i < customers.length; i += BATCH_SIZE) {
        const batch = customers.slice(i, i + BATCH_SIZE);
        const operations = [];
        
        for (const c of batch) {
          const isNew = !existingIds.has(c.CODCLIENTE);
          if (isNew) stats.new++;
          else stats.updated++;
          
          operations.push({
            updateOne: {
              filter: { legacyId: c.CODCLIENTE },
              update: {
                $set: {
                  legacyId: c.CODCLIENTE,
                  name: c.NOME || c.FANTASIA,
                  fantasyName: c.FANTASIA,
                  email: c.EMAIL,
                  phone: c.TEL1 ? `${c.DDD?.trim() || ''} ${c.TEL1}`.trim() : '',
                  phone2: c.TEL2,
                  address: c.ENDERECO,
                  number: c.NUMERO,
                  neighborhood: c.BAIRRO,
                  city: c.MUNICIPIO,
                  state: c.UF?.trim(),
                  zipCode: c.CEP,
                  cpfCnpj: c.CGC || c.CIC,
                  stateRegistration: c.INSCRICAO,
                  rg: c.RG,
                  contact: c.CONTATO,
                  department: c.DEPARTAMENTO,
                  personType: c.PESSOA,
                  birthDate: c.NASCIMENTO,
                  notes: c.OBS,
                  blocked: c.FLAGBLOQUEADO,
                  type: c.TIPO,
                  regionCode: c.CODREGIAO,
                  vendorCode: c.VENDEDOR,
                  tablePrice: c.TABELA,
                  deliveryAddress: c.ENDERECO_ENT,
                  deliveryCity: c.CIDADE_ENT,
                  deliveryNeighborhood: c.BAIRRO_ENT,
                  deliveryState: c.UF_ENT,
                  deliveryZipCode: c.CEP_ENT,
                }
              },
              upsert: true
            }
          });
        }
        
        try {
          await Customer.bulkWrite(operations, { ordered: false });
          stats.imported += batch.length;
          this.log(`Processados ${stats.imported}/${customers.length} clientes (${stats.new} novos, ${stats.updated} atualizados)`);
        } catch (error) {
          stats.errors += batch.length;
          errors.push(`Erro no lote ${i}-${i + BATCH_SIZE}: ${error}`);
          this.log(`Erro no lote de clientes: ${error}`);
        }
      }
      
      this.log(`Importação de clientes concluída: ${stats.new} novos, ${stats.updated} atualizados, ${stats.errors} erros`);
    } catch (error) {
      const errorMsg = `Erro ao importar clientes: ${error}`;
      errors.push(errorMsg);
      this.log(errorMsg);
    }

    return { stats, errors };
  }

  async importProducts() {
    const stats = { imported: 0, errors: 0, new: 0, updated: 0 };
    const errors: string[] = [];

    try {
      this.log('Iniciando importação de produtos...');
      const products = await this.query<any>("SELECT * FROM PRODUTO");
      this.log(`Encontrados ${products.length} produtos no banco Firebird`);
      
      const groups = await this.query<any>("SELECT * FROM GRUPO");
      const groupMap = new Map(groups.map((g: any) => [g.CODGRUPO, g.GRUPO]));
      
      const existingIds = new Set(
        (await Products.find({}, { "specifications.legacyId": 1 }).lean())
          .map(p => p.specifications?.legacyId)
          .filter(Boolean)
      );
      this.log(`${existingIds.size} produtos já existem no MongoDB`);
      
      const BATCH_SIZE = 100;
      for (let i = 0; i < products.length; i += BATCH_SIZE) {
        const batch = products.slice(i, i + BATCH_SIZE);
        const operations = [];
        
        for (const p of batch) {
          const isNew = !existingIds.has(p.CODPRODUTO);
          if (isNew) stats.new++;
          else stats.updated++;
          
          const categoryName = groupMap.get(p.CODGRUPO) || "Sem Categoria";
          
          operations.push({
            updateOne: {
              filter: { "specifications.legacyId": p.CODPRODUTO },
              update: {
                $set: {
                  name: p.DESCRICAO,
                  description: p.DESCRICAO,
                  category: categoryName,
                  specifications: {
                    legacyId: p.CODPRODUTO,
                    groupCode: p.CODGRUPO,
                    unit: p.UNIDADE,
                    barcode: p.CODBARRA,
                    reference: p.REFERENCIA,
                    purchasePrice: p.VALOR_COMPRA,
                    salePrice1: p.VALOR_VENDA1,
                    salePrice2: p.VALOR_VENDA2,
                    salePrice3: p.VALOR_VENDA3,
                    minStock: p.ESTOQUE_MIN,
                    currentStock: p.ESTOQUE_REAL,
                    supplierCode: p.CODFORNECEDOR,
                    colorCode: p.CODCOR,
                    profitPercent: p.PERC_LUCRO,
                    weight: p.PESO,
                    ipi: p.IPI,
                    status: p.STATUS,
                  },
                }
              },
              upsert: true
            }
          });
        }
        
        try {
          await Products.bulkWrite(operations, { ordered: false });
          stats.imported += batch.length;
          this.log(`Processados ${stats.imported}/${products.length} produtos (${stats.new} novos, ${stats.updated} atualizados)`);
        } catch (error) {
          stats.errors += batch.length;
          errors.push(`Erro no lote ${i}-${i + BATCH_SIZE}: ${error}`);
          this.log(`Erro no lote de produtos: ${error}`);
        }
      }
      
      this.log(`Importação de produtos concluída: ${stats.new} novos, ${stats.updated} atualizados, ${stats.errors} erros`);
    } catch (error) {
      const errorMsg = `Erro ao importar produtos: ${error}`;
      errors.push(errorMsg);
      this.log(errorMsg);
    }

    return { stats, errors };
  }

  async importOrders() {
    const stats = { imported: 0, errors: 0, new: 0, updated: 0 };
    const errors: string[] = [];

    try {
      this.log('Iniciando importação de pedidos...');
      const orders = await this.query<any>("SELECT * FROM PEDIDO");
      this.log(`Encontrados ${orders.length} pedidos no banco Firebird`);
      const items = await this.query<any>("SELECT * FROM ITEM_PEDIDO");
      this.log(`Encontrados ${items.length} itens de pedido no banco Firebird`);
      
      const existingIds = new Set(
        (await Order.find({}, { legacyId: 1 }).lean()).map(o => o.legacyId)
      );
      this.log(`${existingIds.size} pedidos já existem no MongoDB`);
      
      // Criar mapa de itens por pedido
      const itemsMap = new Map<number, any[]>();
      items.forEach((item: any) => {
        if (!itemsMap.has(item.CODPEDIDO)) {
          itemsMap.set(item.CODPEDIDO, []);
        }
        itemsMap.get(item.CODPEDIDO)!.push(item);
      });
      
      // Buscar todos os clientes e produtos de uma vez
      const customers = await Customer.find({}).lean();
      const customerMap = new Map(customers.map(c => [c.legacyId, c._id]));
      
      const products = await Products.find({}).lean();
      const productMap = new Map(
        products.map(p => [p.specifications?.legacyId, { _id: p._id, name: p.name }])
      );

      const BATCH_SIZE = 50;
      for (let i = 0; i < orders.length; i += BATCH_SIZE) {
        const batch = orders.slice(i, i + BATCH_SIZE);
        const operations = [];
        
        for (const o of batch) {
          const isNew = !existingIds.has(o.CODPEDIDO);
          if (isNew) stats.new++;
          else stats.updated++;
          
          const orderItems = itemsMap.get(o.CODPEDIDO) || [];
          const mappedItems = orderItems.map((item: any) => {
            const product = productMap.get(item.CODPRODUTO);
            return {
              productId: product?._id,
              productName: product?.name || `Produto ${item.CODPRODUTO}`,
              legacyProductCode: item.CODPRODUTO,
              quantity: item.QUANTIDADE || 0,
              unitPrice: item.VALOR_VENDA || 0,
              discount: item.VALOR_DESCONTO || 0,
              costPrice: item.VALOR_CUSTO || 0,
              totalPrice: (item.QUANTIDADE || 0) * (item.VALOR_VENDA || 0) - (item.VALOR_DESCONTO || 0),
            };
          });

          operations.push({
            updateOne: {
              filter: { legacyId: o.CODPEDIDO },
              update: {
                $set: {
                  legacyId: o.CODPEDIDO,
                  customerId: customerMap.get(o.CODCLIENTE),
                  customerLegacyId: o.CODCLIENTE,
                  orderDate: o.DATA_PEDIDO,
                  vendorCode: o.CODVENDEDOR,
                  status: o.CODSTATUS,
                  conditionCode: o.CODCONDICAO,
                  tablePrice: o.TABELA,
                  discountPercent: o.PER_DESCONTO,
                  discount: o.DESCONTO,
                  totalItems: o.TOTAL_ITENS,
                  totalAmount: o.TOTAL_PEDIDO,
                  notes: o.OBSERVACAO,
                  deliveryDate: o.DATA_ENTREGA,
                  invoiceNumber: o.NOTA_FISCAL,
                  items: mappedItems,
                }
              },
              upsert: true
            }
          });
        }
        
        try {
          await Order.bulkWrite(operations, { ordered: false });
          stats.imported += batch.length;
          this.log(`Processados ${stats.imported}/${orders.length} pedidos (${stats.new} novos, ${stats.updated} atualizados)`);
        } catch (error) {
          stats.errors += batch.length;
          errors.push(`Erro no lote ${i}-${i + BATCH_SIZE}: ${error}`);
          this.log(`Erro no lote de pedidos: ${error}`);
        }
      }
      
      this.log(`Importação de pedidos concluída: ${stats.new} novos, ${stats.updated} atualizados, ${stats.errors} erros`);
    } catch (error) {
      const errorMsg = `Erro ao importar pedidos: ${error}`;
      errors.push(errorMsg);
      this.log(errorMsg);
    }

    return { stats, errors };
  }

  async runFullImport(fileName: string) {
    const startTime = Date.now();
    this.log(`========== INICIANDO IMPORTAÇÃO OTIMIZADA ==========`);
    this.log(`Arquivo: ${fileName}`);
    this.log(`Modo: Batch Insert (5x mais rápido)`);
    
    // Buscar última sincronização
    const lastImport = await ImportHistory.findOne().sort({ importDate: -1 }).lean();
    if (lastImport) {
      this.lastSyncDate = lastImport.importDate;
      this.log(`Última sincronização: ${this.lastSyncDate.toLocaleString('pt-BR')}`);
    } else {
      this.log(`Primeira importação - processando todos os registros`);
    }
    
    const customers = await this.importCustomers();
    const products = await this.importProducts();
    const orders = await this.importOrders();

    const allErrors = [...customers.errors, ...products.errors, ...orders.errors];
    const status = allErrors.length === 0 ? "success" : allErrors.length > 10 ? "error" : "partial";
    
    const processingTime = Math.round((Date.now() - startTime) / 1000);

    await ImportHistory.create({
      fileName,
      status,
      stats: {
        customers: customers.stats,
        products: products.stats,
        orders: orders.stats,
      },
      errors: allErrors,
      lastSyncDate: new Date(),
      processingTime,
    });

    this.log(`========== IMPORTAÇÃO CONCLUÍDA ==========`);
    this.log(`Status: ${status}`);
    this.log(`Tempo de processamento: ${processingTime}s`);
    this.log(`Total de erros: ${allErrors.length}`);

    return {
      status,
      stats: { customers: customers.stats, products: products.stats, orders: orders.stats },
      errors: allErrors,
      logs: this.logs,
      processingTime,
    };
  }
}
