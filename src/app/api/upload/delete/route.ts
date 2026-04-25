import { NextRequest, NextResponse } from "next/server";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Whitelist de extensões permitidas para deleção
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

/**
 * Valida se a URL pertence ao bucket esperado
 */
function isValidBucketUrl(imageUrl: string): boolean {
  const bucketName = process.env.AWS_S3_BUCKET_PRODUCTS;
  const region = process.env.AWS_REGION;
  
  if (!bucketName || !region) return false;
  
  // Formatos válidos de URL do S3
  const validUrls = [
    `https://${bucketName}.s3.${region}.amazonaws.com`,
    `https://${bucketName}.s3.amazonaws.com`,
    `https://s3.${region}.amazonaws.com/${bucketName}`,
    `https://s3.amazonaws.com/${bucketName}`,
  ];
  
  return validUrls.some(validUrl => imageUrl.startsWith(validUrl));
}

/**
 * Valida a key extraída da URL
 */
function validateKey(key: string): { valid: boolean; error?: string } {
  if (!key) {
    return { valid: false, error: "Chave da imagem inválida" };
  }
  
  // Não pode conter path traversal
  if (key.includes('..')) {
    return { valid: false, error: "Caminho inválido" };
  }
  
  // Não pode conter barras duplas
  if (key.includes('//')) {
    return { valid: false, error: "Caminho inválido" };
  }
  
  // Não pode começar com barra
  if (key.startsWith('/')) {
    return { valid: false, error: "Caminho inválido" };
  }
  
  // Deve ter extensão válida de imagem
  const keyExtension = key.toLowerCase().match(/\.[^.]+$/);
  if (!keyExtension || !ALLOWED_EXTENSIONS.includes(keyExtension[0])) {
    return { valid: false, error: "Apenas imagens podem ser deletadas" };
  }
  
  // Validar estrutura do path
  const pathParts = key.split('/');
  
  // Não pode estar na raiz do bucket (deve ter pelo menos 1 barra)
  if (pathParts.length < 2) {
    return { valid: false, error: "Caminho não autorizado" };
  }
  
  // Padrão 1: categories/{arquivo}
  if (pathParts.length === 2 && pathParts[0] === 'categories') {
    return { valid: true };
  }
  
  // Padrão 2: {categoria}/{produto}/{arquivo}
  if (pathParts.length === 3) {
    // Validar que nenhuma parte está vazia
    if (pathParts.some(part => !part || part.trim() === '')) {
      return { valid: false, error: "Caminho inválido" };
    }
    return { valid: true };
  }
  
  // Qualquer outro padrão não é permitido
  return { valid: false, error: "Caminho não autorizado" };
}

export async function DELETE(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();
    
    // Validação 1: URL fornecida
    if (!imageUrl) {
      return NextResponse.json({ error: "URL da imagem não fornecida" }, { status: 400 });
    }

    // Validação 2: URL pertence ao bucket esperado
    if (!isValidBucketUrl(imageUrl)) {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    // Extrair key da URL
    let key: string;
    try {
      const url = new URL(imageUrl);
      key = decodeURIComponent(url.pathname.substring(1));
      
      // Se a URL for no formato s3.amazonaws.com/bucket/key, remover o bucket do path
      const bucketName = process.env.AWS_S3_BUCKET_PRODUCTS!;
      if (key.startsWith(`${bucketName}/`)) {
        key = key.substring(bucketName.length + 1);
      }
    } catch (error) {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }
    
    // Validação 3: Validar key extraída
    const validation = validateKey(key);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const bucketName = process.env.AWS_S3_BUCKET_PRODUCTS!;

    await s3.deleteObject({
      Bucket: bucketName,
      Key: key,
    }).promise();
    
    console.log(`✓ Imagem deletada: ${key}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar do S3:", error);
    return NextResponse.json({ error: "Erro ao deletar imagem" }, { status: 500 });
  }
}
