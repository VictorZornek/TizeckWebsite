import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./models/Product";

dotenv.config();

const MONGO_CONNECTION = process.env.MONGO_CONNECTION as string;
const S3_BASE = process.env.S3_BASE as string;

if (!MONGO_CONNECTION) {
  console.error("❌ MONGO_CONNECTION não definido no .env");
  process.exit(1);
}
if (!S3_BASE) {
  console.error("❌ S3_BASE não definido no .env");
  process.exit(1);
}

// Utils

function normalizeForFile(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove acentos
    .replace(/\s+/g, ""); // remove espaços
}

function folderForCategory(category: string) {
  if (category.startsWith("Suporte")) return "suportes";
  if (category === "Bomba") return "bombas";
  if (category === "Torneira") return "torneiras";
  return "outros";
}

function filenameFor(category: string, variant: string) {
  let base = category
    .replace("Suporte MAX", "Suporte Max") // padroniza MAX -> Max
    .replace(/\s+/g, " ");

  const parts = [base, variant].join(" ").trim();
  return `${normalizeForFile(parts)}.png`;
}

function imageUrl(category: string, variant: string) {
  const folder = folderForCategory(category);
  const file = filenameFor(category, variant);
  return `${S3_BASE}/${folder}/${file}`;
}

function shortDescription(name: string, category: string, variant: string) {
  return `Modelo ${variant} da linha ${category}: ${name}.`;
}

// Catálogo real

const catalog: Record<string, string[]> = {
  "Suporte Quadrado": ["Branco","Preto","Prata","Azul","Verde","Vermelho","Laranja"],
  "Suporte Redondo": ["Branco","Preto","Prata","Azul","Verde","Vermelho","Laranja"],
  "Suporte Master": [
    "Cerâmica Branco","Cerâmica Preto","Cerâmica Prata",
    "Plástico Branco","Plástico Preto","Plástico Prata",
    "Alumínio Branco","Alumínio Preto","Alumínio Prata",
  ],
  "Suporte MAX": [
    "Cerâmica Branco","Cerâmica Preto","Cerâmica Prata",
    "Alumínio Branco","Alumínio Preto","Alumínio Prata",
  ],
  "Bomba": ["Plástico","Filtro"],
  "Torneira": [
    "Longa Branca","Média Branca","Curta Branca",
    "Longa Preta","Média Preta","Curta Preta",
  ],
};

function buildProducts() {
  const products: Array<{
    name: string;
    description: string;
    category: string;
    images: string[];
    activated: boolean;
    specifications: Record<string, unknown>;
  }> = [];

  for (const [category, variants] of Object.entries(catalog)) {
    for (const variant of variants) {
      const name =
        category === "Bomba"
          ? `Bomba ${variant}`
          : category === "Torneira"
          ? `Torneira ${variant}`
          : `${category} ${variant}`;

      products.push({
        name,
        description: shortDescription(name, category, variant),
        category,
        images: [imageUrl(category, variant)],
        activated: true,
        specifications: {},
      });
    }
  }

  return products;
}


// Execução

async function resetAndSeed() {
  try {
    await mongoose.connect(MONGO_CONNECTION);
    console.log("✅ Conectado ao MongoDB.");

    const del = await Product.deleteMany({});
    console.log(`🧨 Removidos ${del.deletedCount ?? 0} produtos existentes.`);

    const produtos = buildProducts();
    const inserted = await Product.insertMany(produtos, { ordered: false });
    console.log(`🎉 Inseridos ${inserted.length} produtos.`);

    console.log("\n📦 Produtos inseridos:");
    inserted.forEach((p, i) => {
      const img = Array.isArray((p as any).images) ? (p as any).images[0] : undefined;
      console.log(`${String(i + 1).padStart(2, "0")}. ${p.name} (${p.category})`);
      if (img) console.log(`    img: ${img}`);
    });

  } catch (error) {
    console.error("❌ Erro no seed:", error);

  } finally {
    await mongoose.disconnect();
    console.log("🔌 Conexão encerrada.");

  }
}


resetAndSeed();