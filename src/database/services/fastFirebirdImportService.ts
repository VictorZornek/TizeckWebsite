/* eslint-disable @typescript-eslint/no-explicit-any */
import Firebird from "node-firebird";
import { Connection } from 'mongoose';

interface FirebirdOptions {
  database: string;
  user: string;
  password: string;
}

export class FastFirebirdImportService {
  private options: FirebirdOptions;
  private logs: string[] = [];
  private conn: Connection;

  constructor(dbPath: string, mongoConnection: Connection) {
    this.options = {
      database: dbPath,
      user: "SYSDBA",
      password: "masterkey",
    };
    this.conn = mongoConnection;
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
    try {
      this.log('Importando clientes...');
      const customers = await this.query<any>("SELECT * FROM CLIENTES");
      
      const documents = customers.map(c => {
        let notes = c.OBS;
        if (typeof notes === 'function' || (notes && typeof notes === 'object')) {
          notes = null;
        } else if (typeof notes === 'string' && (notes.includes('transaction, callback') || notes.includes('function'))) {
          notes = null;
        }
        
        return {
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
        };
      });

      if (documents.length > 0) {
        await this.conn.db.collection('legacycustomers').insertMany(documents, { ordered: false });
      }
      stats.imported = documents.length;
      stats.new = documents.length;
      this.log(`✓ ${documents.length} clientes`);
    } catch (error) {
      this.log(`Erro: ${error}`);
      stats.errors++;
    }
    return { stats, errors: [] };
  }

  async importProducts() {
    const stats = { imported: 0, errors: 0, new: 0, updated: 0 };
    try {
      this.log('Importando produtos...');
      const products = await this.query<any>("SELECT * FROM PRODUTO");
      const groups = await this.query<any>("SELECT * FROM GRUPO");
      const groupMap = new Map(groups.map((g: any) => [g.CODGRUPO, g.GRUPO]));
      
      const documents = products.map(p => ({
        name: p.DESCRICAO,
        description: p.DESCRICAO,
        category: groupMap.get(p.CODGRUPO) || "Sem Categoria",
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
      }));

      if (documents.length > 0) {
        await this.conn.db.collection('legacyproducts').insertMany(documents, { ordered: false });
      }
      stats.imported = documents.length;
      stats.new = documents.length;
      this.log(`✓ ${documents.length} produtos`);
    } catch (error) {
      this.log(`Erro: ${error}`);
      stats.errors++;
    }
    return { stats, errors: [] };
  }

  async importOrders() {
    const stats = { imported: 0, errors: 0, new: 0, updated: 0 };
    try {
      this.log('Importando pedidos...');
      const orders = await this.query<any>("SELECT * FROM PEDIDO");
      const items = await this.query<any>("SELECT * FROM ITEM_PEDIDO");
      
      const itemsMap = new Map<number, any[]>();
      items.forEach((item: any) => {
        if (!itemsMap.has(item.CODPEDIDO)) {
          itemsMap.set(item.CODPEDIDO, []);
        }
        itemsMap.get(item.CODPEDIDO)!.push(item);
      });
      
      const customers = await this.conn.db.collection('legacycustomers').find({}).toArray();
      const customerMap = new Map(customers.map(c => [c.legacyId, c._id]));
      
      const products = await this.conn.db.collection('legacyproducts').find({}).toArray();
      const productMap = new Map(products.map(p => [p.specifications?.legacyId, { _id: p._id, name: p.name }]));

      const documents = orders.map(o => {
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

        return {
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
        };
      });

      if (documents.length > 0) {
        await this.conn.db.collection('legacyorders').insertMany(documents, { ordered: false });
      }
      stats.imported = documents.length;
      stats.new = documents.length;
      this.log(`✓ ${documents.length} pedidos`);
    } catch (error) {
      this.log(`Erro: ${error}`);
      stats.errors++;
    }
    return { stats, errors: [] };
  }

  private async importGenericTable(tableName: string, collectionName: string, mapper: (row: any) => any) {
    const stats = { imported: 0, errors: 0, new: 0, updated: 0 };
    try {
      const data = await this.query<any>(`SELECT * FROM ${tableName}`);
      if (data.length === 0) return { stats, errors: [] };
      
      const documents = data.map(mapper);
      await this.conn.db.collection(collectionName).insertMany(documents, { ordered: false });
      stats.imported = documents.length;
      stats.new = documents.length;
      this.log(`✓ ${documents.length} ${tableName}`);
    } catch (error) {
      this.log(`Erro ${tableName}: ${error}`);
      stats.errors++;
    }
    return { stats, errors: [] };
  }

  async runFullImport(fileName: string) {
    const startTime = Date.now();
    this.log(`========== IMPORTAÇÃO RÁPIDA ==========`);
    this.log(`Arquivo: ${fileName}`);
    
    const customers = await this.importCustomers();
    const products = await this.importProducts();
    const orders = await this.importOrders();
    
    const paymentConditions = await this.importGenericTable("CONDICAO", "paymentconditions", (c: any) => ({
      legacyId: c.CODCONDICAO,
      name: c.CONDICAO,
      installments: c.NUM_PARCELAS,
    }));

    const accounts = await this.importGenericTable("CONTAS", "accounts", (a: any) => ({
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

    const stockEntries = await this.importGenericTable("ITEM_ENTRADA", "stockentries", (s: any) => ({
      entryCode: s.CODENTRADA,
      itemCode: s.CODITEM,
      quantity: s.QUANTIDADE,
      productCode: s.CODPRODUTO,
      entryDate: s.DATAENTRADA,
    }));

    const jobFunctions = await this.importGenericTable("FUNCAO", "jobfunctions", (f: any) => ({
      legacyId: f.CODFUNCAO,
      name: f.FUNCAO,
    }));

    const employees = await this.importGenericTable("FUNCIONA", "employees", (e: any) => ({
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

    const regions = await this.importGenericTable("REGIAO", "regions", (r: any) => ({
      legacyId: r.CODREGIAO,
      name: r.REGIAO,
      tax: r.IMPOSTO,
    }));

    const conditionItems = await this.importGenericTable("ITEM_CONDICAO", "conditionitems", (i: any) => ({
      conditionCode: i.CODCONDICAO,
      itemCode: i.CODITEM,
      daysQuantity: i.QTDE_DIAS,
    }));

    const orderInstallments = await this.importGenericTable("PARCELA_PEDIDO", "orderinstallments", (p: any) => ({
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
    }));

    const companySettings = await this.importGenericTable("PARAMETROS", "companysettings", (p: any) => ({
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

    const customerItems = await this.importGenericTable("ITEM_CLIENTE", "customeritems", (i: any) => ({
      customerCode: i.CODCLIENTE,
      itemCode: i.CODITEM,
      quantity: i.QTDE,
      value: i.VALOR,
      date: i.DATA,
      userCode: i.CODUSUARIO,
      discount: i.DESCONTO,
      tableUsed: i.TABELA_USADA,
    }));

    const systemUsers = await this.importGenericTable("USUARIO1", "systemusers", (u: any) => ({
      legacyId: u.CODUSER,
      username: u.USUARIO,
      password: u.SENHA,
      employeeCode: u.CODFUNCIONARIO,
    }));

    const processingTime = Math.round((Date.now() - startTime) / 1000);
    this.log(`========== CONCLUÍDO EM ${processingTime}s ==========`);

    return {
      status: 'success',
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
      errors: [],
      logs: this.logs,
      processingTime,
    };
  }
}
