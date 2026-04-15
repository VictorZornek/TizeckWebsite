const Firebird = require("node-firebird");
const path = require("path");

const dbPath = path.join(process.cwd(), "KONE_VD.GDB");

const options = {
  database: dbPath,
  user: "SYSDBA",
  password: "masterkey",
};

// Tabelas principais para importar
const mainTables = [
  "CLIENTES",
  "PRODUTO", 
  "PEDIDO",
  "ITEM_PEDIDO",
  "FUNCIONA",
  "GRUPO",
  "EMPRESA",
  "TRANSPORTADORA",
  "CONDICAO",
  "ENTRADA",
  "ITEM_ENTRADA",
  "SAIDA",
  "ITEM_SAIDA"
];

console.log("========================================");
console.log("ANÁLISE DETALHADA DO BANCO FIREBIRD");
console.log("========================================\n");
console.log("Caminho:", dbPath);
console.log("\nConectando...\n");

Firebird.attach(options, (err, db) => {
  if (err) {
    console.error("❌ Erro ao conectar:", err.message);
    return;
  }

  console.log("✅ Conectado com sucesso!\n");

  let processed = 0;

  console.log(`Analisando ${mainTables.length} tabelas principais...\n`);

  mainTables.forEach((tableName, index) => {
    console.log(`[${index + 1}/${mainTables.length}] Processando ${tableName}...`);
    
    // Buscar estrutura da tabela
    db.query(
      `SELECT 
        r.RDB$FIELD_NAME as FIELD_NAME,
        f.RDB$FIELD_TYPE as FIELD_TYPE,
        f.RDB$FIELD_LENGTH as FIELD_LENGTH
      FROM RDB$RELATION_FIELDS r
      LEFT JOIN RDB$FIELDS f ON r.RDB$FIELD_SOURCE = f.RDB$FIELD_NAME
      WHERE r.RDB$RELATION_NAME = '${tableName}'
      ORDER BY r.RDB$FIELD_POSITION`,
      [],
      (err, fields) => {
        if (err) {
          console.log(`❌ ${tableName}: Erro ao buscar estrutura - ${err.message}`);
          processed++;
          checkComplete();
          return;
        }

        console.log(`   ✓ Estrutura obtida (${fields.length} campos)`);

        // Buscar contagem
        db.query(`SELECT COUNT(*) as TOTAL FROM ${tableName}`, [], (err, count) => {
          const total = !err && count.length > 0 ? count[0].TOTAL : 0;
          console.log(`   ✓ Total de registros: ${total}`);

          // Buscar amostra de dados
          db.query(`SELECT FIRST 3 * FROM ${tableName}`, [], (err, sample) => {
            console.log(`   ✓ Amostra obtida\n`);
            
            console.log(`\n${"=".repeat(60)}`);
            console.log(`📋 ${tableName}`);
            console.log(`${"=".repeat(60)}`);
            console.log(`Total de registros: ${total}`);
            console.log(`\nColunas (${fields.length}):`);
            
            fields.forEach((field) => {
              const fieldName = field.FIELD_NAME.trim();
              const fieldType = getFieldType(field.FIELD_TYPE);
              console.log(`  - ${fieldName} (${fieldType})`);
            });

            if (sample && sample.length > 0) {
              console.log(`\nAmostra de dados (${sample.length} registros):`);
              sample.forEach((row, idx) => {
                console.log(`\n  Registro ${idx + 1}:`);
                Object.keys(row).forEach((key) => {
                  let value = row[key];
                  if (value === null) value = "NULL";
                  else if (typeof value === "string") value = value.trim();
                  console.log(`    ${key}: ${value}`);
                });
              });
            }

            processed++;
            checkComplete();
          });
        });
      }
    );
  });

  function checkComplete() {
    if (processed === mainTables.length) {
      setTimeout(() => {
        db.detach();
        console.log("\n" + "=".repeat(60));
        console.log("✅ ANÁLISE CONCLUÍDA");
        console.log("=".repeat(60) + "\n");
      }, 1000);
    }
  }
});

function getFieldType(typeCode) {
  const types = {
    7: "SMALLINT",
    8: "INTEGER",
    10: "FLOAT",
    12: "DATE",
    13: "TIME",
    14: "CHAR",
    16: "BIGINT",
    27: "DOUBLE",
    35: "TIMESTAMP",
    37: "VARCHAR",
    261: "BLOB",
  };
  return types[typeCode] || `TYPE_${typeCode}`;
}
