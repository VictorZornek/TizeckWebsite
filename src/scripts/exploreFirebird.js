const Firebird = require("node-firebird");
const path = require("path");

const dbPath = path.join(process.cwd(), "KONE_VD.GDB");

const options = {
  database: dbPath,
  user: "SYSDBA",
  password: "masterkey",
};

console.log("Conectando ao banco Firebird...");
console.log("Caminho do banco:", dbPath);
console.log("");

Firebird.attach(options, (err, db) => {
  if (err) {
    console.error("Erro ao conectar:", err);
    return;
  }

  console.log("✅ Conectado com sucesso!\n");
  console.log("Listando todas as tabelas...\n");

  // Listar todas as tabelas
  db.query(
    "SELECT RDB$RELATION_NAME FROM RDB$RELATIONS WHERE RDB$SYSTEM_FLAG = 0 ORDER BY RDB$RELATION_NAME",
    [],
    (err, tables) => {
      if (err) {
        console.error("Erro ao listar tabelas:", err);
        db.detach();
        return;
      }

      const tableNames = tables.map(t => t.RDB$RELATION_NAME.trim());
      console.log(`Encontradas ${tableNames.length} tabelas:\n`);
      tableNames.forEach((name, i) => console.log(`${i + 1}. ${name}`));

      console.log("\n========== ESTRUTURA DAS TABELAS ==========\n");

      let processed = 0;
      tableNames.forEach((tableName) => {
        db.query(
          `SELECT FIRST 1 * FROM ${tableName}`,
          [],
          (err, rows) => {
            processed++;
            
            if (err) {
              console.log(`\n❌ ${tableName}: Erro ao acessar`);
            } else {
              console.log(`\n✅ ${tableName}:`);
              if (rows.length > 0) {
                const columns = Object.keys(rows[0]);
                console.log(`   Colunas (${columns.length}): ${columns.join(", ")}`);
                console.log(`   Registros: Consultando...`);
                
                db.query(`SELECT COUNT(*) as TOTAL FROM ${tableName}`, [], (err, count) => {
                  if (!err && count.length > 0) {
                    console.log(`   Total de registros: ${count[0].TOTAL}`);
                  }
                });
              } else {
                console.log("   Tabela vazia");
              }
            }

            if (processed === tableNames.length) {
              setTimeout(() => {
                db.detach();
                console.log("\n========== ANÁLISE CONCLUÍDA ==========\n");
              }, 2000);
            }
          }
        );
      });
    }
  );
});
