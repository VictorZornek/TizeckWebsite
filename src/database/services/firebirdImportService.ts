import Firebird from "node-firebird";
import { connectMongoLegacy } from "../dbLegacy";
import Customer from "../models/Customer";
import Order from "../models/Order";
import Products from "../models/Product";
import ImportHistory from "../models/ImportHistory";
import PaymentCondition from "../models/PaymentCondition";
import Account from "../models/Account";
import StockEntry from "../models/StockEntry";
import JobFunction from "../models/JobFunction";
import Employee from "../models/Employee";
import Region from "../models/Region";
import ConditionItem from "../models/ConditionItem";
import OrderInstallment from "../models/OrderInstallment";
import CompanySettings from "../models/CompanySettings";
import CustomerItem from "../models/CustomerItem";
import SystemUser from "../models/SystemUser";

interface FirebirdOptions {
  database: string;
  user: string;
  password: string;
}

export class FirebirdImportService {
  private options: FirebirdOptions;
  private logs: string[] = [];
  private lastSyncDate: Date | null = null;
  private conn: any = null;

  constructor(dbPath: string) {
    this.options = {
      database: dbPath,
      user: "SYSDBA",
      password: "masterkey",
    };
  }

  private async getConnection() {
    if (!this.conn) {
      this.conn = await connectMongoLegacy();
    }
    return this.conn;
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
      
      const conn = await this.getConnection();
      const CustomerModel = conn.models.LegacyCustomer || conn.model('LegacyCustomer', Customer.schema);
      
      // Buscar IDs existentes no MongoDB
      const existingIds = new Set(
        (await CustomerModel.find({}, { legacyId: 1 }).lean()).map((c: { legacyId: number }) => c.legacyId)
      );
      this.log(`${existingIds.size} clientes já existem no MongoDB`);
      
      // Processar em lotes de 500
      const BATCH_SIZE = 500;
      for (let i = 0; i < customers.length; i += BATCH_SIZE) {
        const batch = customers.slice(i, i + BATCH_SIZE);
        const operations = [];
        
        for (const c of batch) {
          const isNew = !existingIds.has(c.CODCLIENTE);
          if (isNew) stats.new++;
          else stats.updated++;
          
          // Limpar campo OBS se contiver código JavaScript (erro de leitura do Firebird)
          let notes = c.OBS;
          
          if (typeof notes === 'function') {
            // Se for function, é erro do Firebird - limpar
            notes = null;
          } else if (notes && typeof notes === 'object') {
            // Se for objeto/buffer, converter para string e verificar
            const notesStr = notes.toString();
            if (notesStr.includes('transaction, callback') || notesStr.includes('function')) {
              notes = null;
            } else {
              notes = notesStr.trim();
            }
          } else if (typeof notes === 'string') {
            if (notes.includes('transaction, callback') || notes.includes('function')) {
              notes = null;
            } else {
              notes = notes.trim();
            }
          }
          
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
                  notes: notes,
                  blocked: c.FLAGBLOQUEADO?.trim(),
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
          await CustomerModel.bulkWrite(operations, { ordered: false });
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
      
      const conn = await this.getConnection();
      const ProductsModel = conn.models.LegacyProduct || conn.model('LegacyProduct', Products.schema);
      
      const existingIds = new Set(
        (await ProductsModel.find({}, { "specifications.legacyId": 1 }).lean())
          .map((p: { specifications?: { legacyId?: number } }) => p.specifications?.legacyId)
          .filter(Boolean)
      );
      this.log(`${existingIds.size} produtos já existem no MongoDB`);
      
      const BATCH_SIZE = 500;
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
          await ProductsModel.bulkWrite(operations, { ordered: false });
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
      
      const conn = await this.getConnection();
      const OrderModel = conn.models.LegacyOrder || conn.model('LegacyOrder', Order.schema);
      const CustomerModel = conn.models.LegacyCustomer || conn.model('LegacyCustomer', Customer.schema);
      const ProductsModel = conn.models.LegacyProduct || conn.model('LegacyProduct', Products.schema);
      
      const existingIds = new Set(
        (await OrderModel.find({}, { legacyId: 1 }).lean()).map((o: { legacyId: number }) => o.legacyId)
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
      const customers = await CustomerModel.find({}).lean();
      const customerMap = new Map(customers.map((c: { legacyId: number; _id: unknown }) => [c.legacyId, c._id]));
      
      const products = await ProductsModel.find({}).lean();
      const productMap = new Map(
        products.map((p: { specifications?: { legacyId?: number }; _id: unknown; name: string }) => [p.specifications?.legacyId, { _id: p._id, name: p.name }])
      );

      const BATCH_SIZE = 250;
      for (let i = 0; i < orders.length; i += BATCH_SIZE) {
        const batch = orders.slice(i, i + BATCH_SIZE);
        const operations = [];
        
        for (const o of batch) {
          const isNew = !existingIds.has(o.CODPEDIDO);
          if (isNew) stats.new++;
          else stats.updated++;
          
          const orderItems = itemsMap.get(o.CODPEDIDO) || [];
          const mappedItems = orderItems.map((item: any) => {
            const product = productMap.get(item.CODPRODUTO) as { _id: unknown; name: string } | undefined;
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
          await OrderModel.bulkWrite(operations, { ordered: false });
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

  async importPaymentConditions() {
    return this.importGenericTable("CONDICAO", "PaymentCondition", PaymentCondition, (c: any) => ({
      legacyId: c.CODCONDICAO,
      name: c.CONDICAO,
      installments: c.NUM_PARCELAS,
    }));
  }

  async importAccounts() {
    return this.importGenericTable("CONTAS", "Account", Account, (a: any) => ({
      legacyId: a.CODCONTA,
      installmentCode: a.CODPARCELA,
      customerSupplierCode: a.CODCLIFOR,
      issueDate: a.DATA_EMISSAO,
      dueDate: a.DATA_VENCIMENTO,
      paymentDate: a.DATA_BAIXA,
      vendorCode: a.CODVENDEDOR,
      checkNumber: a.NUMCHEQUE,
      conditionCode: a.CODCONDICAO,
      accountNumber: a.CODCONTACORRENTE,
      history: a.HISTORICO,
      accountType: a.TIPO_CONTA,
      installmentValue: a.VALOR_PARCELA,
      paidValue: a.VALOR_PAGO,
      debit: a.DEBITO,
      realDebit: a.DEBITO_REAL,
      discount: a.DESCONTO,
      paymentType: a.TIPO_PAGAMENTO,
      operatorCode: a.CODOPERADORA,
      closedDate: a.DATA_ENCERRADO,
      commission: a.COMISSAO,
      commissionPaymentDate: a.DT_PAG_COMISS,
    }));
  }

  async importStockEntries() {
    return this.importGenericTable("ITEM_ENTRADA", "StockEntry", StockEntry, (s: any) => ({
      entryCode: s.CODENTRADA,
      itemCode: s.CODITEM,
      quantity: s.QUANTIDADE,
      productCode: s.CODPRODUTO,
      entryDate: s.DATAENTRADA,
    }), "entryCode", "itemCode");
  }

  async importJobFunctions() {
    return this.importGenericTable("FUNCAO", "JobFunction", JobFunction, (f: any) => ({
      legacyId: f.CODFUNCAO,
      name: f.FUNCAO,
    }));
  }

  async importEmployees() {
    return this.importGenericTable("FUNCIONA", "Employee", Employee, (e: any) => ({
      legacyId: e.CODFUNCIONARIO,
      userId: e.CODUSUARIO,
      name: e.NOME,
      rg: e.RG,
      cpf: e.CPF,
      positionCode: e.CODCARGO,
      shortName: e.NOME_ABREV,
      active: e.FLAGATIVO,
      address: e.ENDERECO,
      neighborhood: e.BAIRRO,
      city: e.CIDADE,
      state: e.UF,
      info: e.INFORMACOES,
      birthDate: e.NASC,
      phone: e.TEL_RESIDENCIA,
      mobile: e.CELULAR,
      functionCode: e.CODFUNCAO,
      commission1: e.COMISSAO1,
      commission2: e.COMISSAO2,
      commission3: e.COMISSAO3,
    }));
  }

  async importRegions() {
    return this.importGenericTable("REGIAO", "Region", Region, (r: any) => ({
      legacyId: r.CODREGIAO,
      name: r.REGIAO,
      tax: r.IMPOSTO,
    }));
  }

  async importConditionItems() {
    return this.importGenericTable("ITEM_CONDICAO", "ConditionItem", ConditionItem, (i: any) => ({
      conditionCode: i.CODCONDICAO,
      itemCode: i.CODITEM,
      daysQuantity: i.QTDE_DIAS,
    }), "conditionCode", "itemCode");
  }

  async importOrderInstallments() {
    return this.importGenericTable("PARCELA_PEDIDO", "OrderInstallment", OrderInstallment, (p: any) => ({
      orderCode: p.CODPEDIDO,
      installmentCode: p.CODPARCELA,
      dueDate: p.VENCIMENTO,
      paymentDate: p.PAGAMENTO,
      installmentValue: p.VALOR_PARCELA,
      paymentValue: p.VALOR_PAGAMENTO,
      status: p.SITUACAO,
      paymentMethod: p.FORMA_PAGAMENTO,
      operatorCode: p.CODOPERADORA,
      document: p.DOCUMENTO,
    }), "orderCode", "installmentCode");
  }

  async importCompanySettings() {
    return this.importGenericTable("PARAMETROS", "CompanySettings", CompanySettings, (p: any) => ({
      legacyId: p.CODEMPRESA,
      companyName: p.RAZAO_SOCIAL,
      tradeName: p.FANTASIA,
      address: p.ENDERECO,
      neighborhood: p.BAIRRO,
      city: p.CIDADE,
      state: p.UF,
      zipCode: p.CEP,
      cnpj: p.CNPJ,
      stateRegistration: p.INSC_EST,
      phone1: p.TELEFONE1,
      phone2: p.TELEFONE2,
      fax: p.FAX,
      email: p.EMAIL,
      website: p.SITE,
      iss: p.ISS,
      footerMessage: p.MSG_RODAPE,
      logo: p.LOGO,
      activeItemsPurchasedByCustomer: p.ATV_ITENS_COMPRADO_CLIENTE,
      activeBarcode: p.ATV_CODBARRA,
      paymentMethod: p.FORMA_DE_PAGAMENTO,
      orderScreen: p.TELA_PEDIDO,
    }));
  }

  async importCustomerItems() {
    return this.importGenericTable("ITEM_CLIENTE", "CustomerItem", CustomerItem, (i: any) => ({
      customerCode: i.CODCLIENTE,
      itemCode: i.CODITEM,
      quantity: i.QTDE,
      value: i.VALOR,
      date: i.DATA,
      userCode: i.CODUSUARIO,
      discount: i.DESCONTO,
      tableUsed: i.TABELA_USADA,
    }), "customerCode", "itemCode", "date");
  }

  async importSystemUsers() {
    return this.importGenericTable("USUARIO1", "SystemUser", SystemUser, (u: any) => ({
      legacyId: u.CODUSER,
      username: u.USUARIO,
      password: u.SENHA,
      employeeCode: u.CODFUNCIONARIO,
    }));
  }

  private async importGenericTable(
    tableName: string,
    modelName: string,
    model: any,
    mapper: (row: any) => any,
    ...uniqueFields: string[]
  ) {
    const stats = { imported: 0, errors: 0, new: 0, updated: 0 };
    const errors: string[] = [];

    try {
      this.log(`Iniciando importação de ${tableName}...`);
      const data = await this.query<any>(`SELECT * FROM ${tableName}`);
      this.log(`Encontrados ${data.length} registros em ${tableName}`);

      if (data.length === 0) {
        this.log(`Nenhum registro encontrado em ${tableName}`);
        return { stats, errors };
      }

      const conn = await this.getConnection();
      const Model = conn.models[modelName] || conn.model(modelName, model.schema);

      const BATCH_SIZE = 500;
      for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        const operations = [];

        for (const row of batch) {
          const mappedData = mapper(row);
          const filter = uniqueFields.length > 0
            ? Object.fromEntries(uniqueFields.map(f => [f, mappedData[f]]))
            : { legacyId: mappedData.legacyId };

          operations.push({
            updateOne: {
              filter,
              update: { $set: mappedData },
              upsert: true,
            },
          });
        }

        try {
          const result = await Model.bulkWrite(operations, { ordered: false });
          stats.imported += batch.length;
          stats.new += result.upsertedCount || 0;
          stats.updated += result.modifiedCount || 0;
          this.log(`Processados ${stats.imported}/${data.length} registros de ${tableName}`);
        } catch (error) {
          stats.errors += batch.length;
          errors.push(`Erro no lote ${i}-${i + BATCH_SIZE} de ${tableName}: ${error}`);
          this.log(`Erro no lote de ${tableName}: ${error}`);
        }
      }

      this.log(`Importação de ${tableName} concluída: ${stats.new} novos, ${stats.updated} atualizados, ${stats.errors} erros`);
    } catch (error) {
      const errorMsg = `Erro ao importar ${tableName}: ${error}`;
      errors.push(errorMsg);
      this.log(errorMsg);
    }

    return { stats, errors };
  }

  async runFullImport(fileName: string) {
    const startTime = Date.now();
    this.log(`========== INICIANDO IMPORTAÇÃO COMPLETA ==========`);
    this.log(`Arquivo: ${fileName}`);
    this.log(`Modo: Batch Insert Otimizado`);
    
    const conn = await this.getConnection();
    const ImportHistoryModel = conn.models.ImportHistory || conn.model('ImportHistory', ImportHistory.schema);
    
    const lastImport = await ImportHistoryModel.findOne().sort({ importDate: -1 }).lean();
    if (lastImport && lastImport.importDate) {
      this.lastSyncDate = lastImport.importDate;
      this.log(`Última sincronização: ${new Date(lastImport.importDate).toLocaleString('pt-BR')}`);
    } else {
      this.log(`Primeira importação - processando todos os registros`);
    }
    
    const customers = await this.importCustomers();
    const products = await this.importProducts();
    const orders = await this.importOrders();
    const paymentConditions = await this.importPaymentConditions();
    const accounts = await this.importAccounts();
    const stockEntries = await this.importStockEntries();
    const jobFunctions = await this.importJobFunctions();
    const employees = await this.importEmployees();
    const regions = await this.importRegions();
    const conditionItems = await this.importConditionItems();
    const orderInstallments = await this.importOrderInstallments();
    const companySettings = await this.importCompanySettings();
    const customerItems = await this.importCustomerItems();
    const systemUsers = await this.importSystemUsers();

    const allErrors = [
      ...customers.errors,
      ...products.errors,
      ...orders.errors,
      ...paymentConditions.errors,
      ...accounts.errors,
      ...stockEntries.errors,
      ...jobFunctions.errors,
      ...employees.errors,
      ...regions.errors,
      ...conditionItems.errors,
      ...orderInstallments.errors,
      ...companySettings.errors,
      ...customerItems.errors,
      ...systemUsers.errors,
    ];
    const status = allErrors.length === 0 ? "success" : allErrors.length > 10 ? "error" : "partial";
    
    const processingTime = Math.round((Date.now() - startTime) / 1000);

    await ImportHistoryModel.create({
      fileName,
      status,
      stats: {
        customers: customers.stats,
        products: products.stats,
        orders: orders.stats,
        paymentConditions: paymentConditions.stats,
        accounts: accounts.stats,
        stockEntries: stockEntries.stats,
        jobFunctions: jobFunctions.stats,
        employees: employees.stats,
        regions: regions.stats,
        conditionItems: conditionItems.stats,
        orderInstallments: orderInstallments.stats,
        companySettings: companySettings.stats,
        customerItems: customerItems.stats,
        systemUsers: systemUsers.stats,
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
      stats: {
        customers: customers.stats,
        products: products.stats,
        orders: orders.stats,
        paymentConditions: paymentConditions.stats,
        accounts: accounts.stats,
        stockEntries: stockEntries.stats,
        jobFunctions: jobFunctions.stats,
        employees: employees.stats,
        regions: regions.stats,
        conditionItems: conditionItems.stats,
        orderInstallments: orderInstallments.stats,
        companySettings: companySettings.stats,
        customerItems: customerItems.stats,
        systemUsers: systemUsers.stats,
      },
      errors: allErrors,
      logs: this.logs,
      processingTime,
    };
  }
}
