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
    const stats = { imported: 0, errors: 0 };
    const errors: string[] = [];

    try {
      this.log('Iniciando importação de clientes...');
      const customers = await this.query<any>("SELECT * FROM CLIENTES");
      this.log(`Encontrados ${customers.length} clientes no banco Firebird`);
      
      for (const c of customers) {
        try {
          await Customer.findOneAndUpdate(
            { legacyId: c.CODCLIENTE },
            {
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
            },
            { upsert: true, new: true }
          );
          stats.imported++;
          if (stats.imported % 100 === 0) {
            this.log(`Importados ${stats.imported} clientes...`);
          }
        } catch (error) {
          stats.errors++;
          errors.push(`Cliente ${c.NOME}: ${error}`);
          this.log(`Erro ao importar cliente ${c.NOME}: ${error}`);
        }
      }
      this.log(`Importação de clientes concluída: ${stats.imported} importados, ${stats.errors} erros`);
    } catch (error) {
      const errorMsg = `Erro ao importar clientes: ${error}`;
      errors.push(errorMsg);
      this.log(errorMsg);
    }

    return { stats, errors };
  }

  async importProducts() {
    const stats = { imported: 0, errors: 0 };
    const errors: string[] = [];

    try {
      this.log('Iniciando importação de produtos...');
      const products = await this.query<any>("SELECT * FROM PRODUTO");
      this.log(`Encontrados ${products.length} produtos no banco Firebird`);
      
      // Buscar grupos para mapear categorias
      const groups = await this.query<any>("SELECT * FROM GRUPO");
      const groupMap = new Map(groups.map((g: any) => [g.CODGRUPO, g.GRUPO]));
      
      for (const p of products) {
        try {
          const categoryName = groupMap.get(p.CODGRUPO) || "Sem Categoria";
          
          await Products.findOneAndUpdate(
            { "specifications.legacyId": p.CODPRODUTO },
            {
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
            },
            { upsert: true, new: true }
          );
          stats.imported++;
          if (stats.imported % 50 === 0) {
            this.log(`Importados ${stats.imported} produtos...`);
          }
        } catch (error) {
          stats.errors++;
          errors.push(`Produto ${p.DESCRICAO}: ${error}`);
          this.log(`Erro ao importar produto ${p.DESCRICAO}: ${error}`);
        }
      }
      this.log(`Importação de produtos concluída: ${stats.imported} importados, ${stats.errors} erros`);
    } catch (error) {
      const errorMsg = `Erro ao importar produtos: ${error}`;
      errors.push(errorMsg);
      this.log(errorMsg);
    }

    return { stats, errors };
  }

  async importOrders() {
    const stats = { imported: 0, errors: 0 };
    const errors: string[] = [];

    try {
      this.log('Iniciando importação de pedidos...');
      const orders = await this.query<any>("SELECT * FROM PEDIDO");
      this.log(`Encontrados ${orders.length} pedidos no banco Firebird`);
      const items = await this.query<any>("SELECT * FROM ITEM_PEDIDO");
      this.log(`Encontrados ${items.length} itens de pedido no banco Firebird`);

      for (const o of orders) {
        try {
          const customer = await Customer.findOne({ legacyId: o.CODCLIENTE });
          const orderItems = items.filter((i: any) => i.CODPEDIDO === o.CODPEDIDO);

          const mappedItems = await Promise.all(
            orderItems.map(async (item: any) => {
              const product = await Products.findOne({ "specifications.legacyId": item.CODPRODUTO });
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
            })
          );

          await Order.findOneAndUpdate(
            { legacyId: o.CODPEDIDO },
            {
              legacyId: o.CODPEDIDO,
              customerId: customer?._id,
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
            },
            { upsert: true, new: true }
          );
          stats.imported++;
          if (stats.imported % 100 === 0) {
            this.log(`Importados ${stats.imported} pedidos...`);
          }
        } catch (error) {
          stats.errors++;
          errors.push(`Pedido ${o.CODPEDIDO}: ${error}`);
          this.log(`Erro ao importar pedido ${o.CODPEDIDO}: ${error}`);
        }
      }
      this.log(`Importação de pedidos concluída: ${stats.imported} importados, ${stats.errors} erros`);
    } catch (error) {
      const errorMsg = `Erro ao importar pedidos: ${error}`;
      errors.push(errorMsg);
      this.log(errorMsg);
    }

    return { stats, errors };
  }

  async runFullImport(fileName: string) {
    this.log(`========== INICIANDO IMPORTAÇÃO COMPLETA ==========`);
    this.log(`Arquivo: ${fileName}`);
    this.log(`Banco de dados: ${this.options.database}`);
    
    const customers = await this.importCustomers();
    const products = await this.importProducts();
    const orders = await this.importOrders();

    const allErrors = [...customers.errors, ...products.errors, ...orders.errors];
    const status = allErrors.length === 0 ? "success" : allErrors.length > 10 ? "error" : "partial";

    await ImportHistory.create({
      fileName,
      status,
      stats: {
        customers: customers.stats,
        products: products.stats,
        orders: orders.stats,
      },
      errors: allErrors,
    });

    this.log(`========== IMPORTAÇÃO CONCLUÍDA ==========`);
    this.log(`Status: ${status}`);
    this.log(`Total de erros: ${allErrors.length}`);

    return {
      status,
      stats: { customers: customers.stats, products: products.stats, orders: orders.stats },
      errors: allErrors,
      logs: this.logs,
    };
  }
}
