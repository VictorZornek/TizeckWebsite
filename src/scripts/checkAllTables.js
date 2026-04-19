const Firebird = require("node-firebird");
const path = require("path");

const dbPath = path.join(process.cwd(), "KONE_VD.GDB");

const options = {
  database: dbPath,
  user: "SYSDBA",
  password: "masterkey",
};

const allTables = [
  "CARGO", "CLIENTES", "CLIENTES2", "COMISSAO", "CONDICAO", "CONFIG_NOTA",
  "CONTAS", "CONTA_CORRENTE", "CONT_CLI", "COR", "CURVAABC", "CURVAABCTMP",
  "EMPRESA", "ENTRADA", "FUNCAO", "FUNCIONA", "GRUPO", "ITEM_CLIENTE",
  "ITEM_CONDICAO", "ITEM_ENTRADA", "ITEM_PEDIDO", "ITEM_SAIDA", "ITENSMENU",
  "NIVEL", "NOTA_FISCAL", "OPER_CARTAO", "PARAMETROS", "PARCELA_PEDIDO",
  "PEDIDO", "PRODUTO", "REGIAO", "SAIDA", "STATUS", "TRANSPORTADORA",
  "TROCA", "USUARIO1", "VERSAO"
];

const importedTables = ["CLIENTES", "PRODUTO", "PEDIDO", "ITEM_PEDIDO", "GRUPO"];

console.log("========================================");
console.log("ANÁLISE COMPLETA DO BANCO FIREBIRD");
console.log("========================================\n");

Firebird.attach(options, (err, db) => {
  if (err) {
    console.error("❌ Erro ao conectar:", err.message);
    return;
  }

  console.log("✅ Conectado!\n");

  let processed = 0;
  const results = [];

  allTables.forEach((tableName) => {
    db.query(`SELECT COUNT(*) as TOTAL FROM ${tableName}`, [], (err, count) => {
      processed++;
      
      const total = !err && count.length > 0 ? count[0].TOTAL : 0;
      const isImported = importedTables.includes(tableName);
      
      results.push({
        table: tableName,
        total,
        imported: isImported,
        error: err ? true : false
      });

      if (processed === allTables.length) {
        // Ordenar por total decrescente
        results.sort((a, b) => b.total - a.total);

        console.log("📊 TABELAS COM DADOS:\n");
        results.filter(r => r.total > 0 && !r.error).forEach(r => {
          const status = r.imported ? "✅ IMPORTADA" : "⚠️  NÃO IMPORTADA";
          console.log(`${status} | ${r.table.padEnd(20)} | ${r.total.toString().padStart(6)} registros`);
        });

        console.log("\n📭 TABELAS VAZIAS:\n");
        results.filter(r => r.total === 0 && !r.error).forEach(r => {
          console.log(`   ${r.table}`);
        });

        console.log("\n❌ TABELAS COM ERRO:\n");
        results.filter(r => r.error).forEach(r => {
          console.log(`   ${r.table}`);
        });

        console.log("\n========================================");
        console.log("RECOMENDAÇÕES:");
        console.log("========================================\n");

        const notImported = results.filter(r => r.total > 0 && !r.imported && !r.error);
        
        if (notImported.length > 0) {
          console.log("Tabelas com dados que NÃO foram importadas:\n");
          notImported.forEach(r => {
            console.log(`  📋 ${r.table} (${r.total} registros)`);
          });
          console.log("\nConsidere importar se forem relevantes para o sistema.\n");
        }

        db.detach();
      }
    });
  });
});
