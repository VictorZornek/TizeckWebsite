import Firebird from "node-firebird";
import Customer from "../models/Customer";
import Order from "../models/Order";
import Products from "../models/Product";
import ImportHistory from "../models/ImportHistory";

interface FirebirdOptions {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export class FirebirdImportService {
  private options: FirebirdOptions;

  constructor(dbPath: string) {
    this.options = {
      host: "localhost",
      port: 3050,
      database: dbPath,
      user: "SYSDBA",
      password: "masterkey",
    };
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
      const customers = await this.query<any>("SELECT * FROM CLIENTES");
      
      for (const c of customers) {
        try {
          await Customer.findOneAndUpdate(
            { legacyId: c.ID || c.CODIGO },
            {
              legacyId: c.ID || c.CODIGO,
              name: c.NOME || c.RAZAO_SOCIAL,
              email: c.EMAIL,
              phone: c.TELEFONE || c.FONE,
              address: c.ENDERECO,
              city: c.CIDADE,
              state: c.ESTADO || c.UF,
              zipCode: c.CEP,
              cpfCnpj: c.CPF || c.CNPJ,
            },
            { upsert: true, new: true }
          );
          stats.imported++;
        } catch (error) {
          stats.errors++;
          errors.push(`Cliente ${c.NOME}: ${error}`);
        }
      }
    } catch (error) {
      errors.push(`Erro ao importar clientes: ${error}`);
    }

    return { stats, errors };
  }

  async importProducts() {
    const stats = { imported: 0, errors: 0 };
    const errors: string[] = [];

    try {
      const products = await this.query<any>("SELECT * FROM PRODUTO");
      
      for (const p of products) {
        try {
          await Products.findOneAndUpdate(
            { name: p.DESCRICAO || p.NOME },
            {
              name: p.DESCRICAO || p.NOME,
              description: p.OBSERVACAO || p.DESCRICAO || "",
              category: p.GRUPO || "Importados",
              specifications: {
                legacyId: p.CODIGO || p.ID,
                reference: p.REFERENCIA,
                unit: p.UNIDADE,
              },
            },
            { upsert: true, new: true }
          );
          stats.imported++;
        } catch (error) {
          stats.errors++;
          errors.push(`Produto ${p.DESCRICAO}: ${error}`);
        }
      }
    } catch (error) {
      errors.push(`Erro ao importar produtos: ${error}`);
    }

    return { stats, errors };
  }

  async importOrders() {
    const stats = { imported: 0, errors: 0 };
    const errors: string[] = [];

    try {
      const orders = await this.query<any>("SELECT * FROM PEDIDO");
      const items = await this.query<any>("SELECT * FROM ITEM_PEDIDO");

      for (const o of orders) {
        try {
          const customer = await Customer.findOne({ legacyId: o.CLIENTE_ID || o.COD_CLIENTE });
          const orderItems = items.filter((i: any) => i.PEDIDO_ID === o.ID || i.COD_PEDIDO === o.CODIGO);

          const mappedItems = await Promise.all(
            orderItems.map(async (item: any) => {
              const product = await Products.findOne({ "specifications.legacyId": item.PRODUTO_ID || item.COD_PRODUTO });
              return {
                productId: product?._id,
                productName: item.DESCRICAO || product?.name,
                quantity: item.QUANTIDADE || 1,
                unitPrice: item.VALOR_UNITARIO || item.PRECO || 0,
                totalPrice: item.VALOR_TOTAL || (item.QUANTIDADE * item.VALOR_UNITARIO) || 0,
              };
            })
          );

          await Order.findOneAndUpdate(
            { legacyId: o.ID || o.CODIGO },
            {
              legacyId: o.ID || o.CODIGO,
              customerId: customer?._id,
              orderDate: o.DATA || o.DATA_PEDIDO,
              totalAmount: o.VALOR_TOTAL || 0,
              status: o.STATUS || "importado",
              items: mappedItems,
            },
            { upsert: true, new: true }
          );
          stats.imported++;
        } catch (error) {
          stats.errors++;
          errors.push(`Pedido ${o.ID}: ${error}`);
        }
      }
    } catch (error) {
      errors.push(`Erro ao importar pedidos: ${error}`);
    }

    return { stats, errors };
  }

  async runFullImport(fileName: string) {
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

    return {
      status,
      stats: { customers: customers.stats, products: products.stats, orders: orders.stats },
      errors: allErrors,
    };
  }
}
