import { NextRequest, NextResponse } from "next/server";
import { createS3Client, getS3Bucket } from "@/lib/aws";
import { logError, logInfo } from "@/lib/logger";

// Whitelist de extensões permitidas para deleção
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

/**
 * Valida se a URL pertence ao bucket esperado
 */
function isValidBucketUrl(imageUrl: string, bucketName: string, region: string): boolean {
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
    // Validar e criar client S3
    const s3 = createS3Client();
    const bucketName = getS3Bucket();
    
    // Obter região para validação de URL
    const region = process.env.AWS_REGION!;
    
    const { imageUrl } = await request.json();
    
    // Validação 1: URL fornecida
    if (!imageUrl) {
      return NextResponse.json({ error: "URL da imagem não fornecida" }, { status: 400 });
    }

    // Validação 2: URL pertence ao bucket esperado
    if (!isValidBucketUrl(imageUrl, bucketName, region)) {
      return NextResponse.json({ error: "URL inválida" }, { status: 400 });
    }

    // Extrair key da URL
    let key: string;
    try {
      const url = new URL(imageUrl);
      key = decodeURIComponent(url.pathname.substring(1));
      
      // Se a URL for no formato s3.amazonaws.com/bucket/key, remover o bucket do path
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

    await s3.deleteObject({
      Bucket: bucketName,
      Key: key,
    }).promise();
    
    logInfo('S3_DELETE', `Imagem deletada: ${key}`);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    logError('S3_DELETE', error);
    return NextResponse.json({ error: "Erro ao deletar imagem" }, { status: 500 });
  }
}
