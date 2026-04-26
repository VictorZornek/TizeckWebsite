import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { createS3Client, getS3Bucket } from "@/lib/aws";

// Whitelist de tipos MIME permitidos
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
];

// Whitelist de extensões permitidas
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

// Tamanho máximo: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Tipos de upload válidos
const VALID_UPLOAD_TYPES = ['category', 'product'];

/**
 * Sanitiza nome de arquivo removendo caracteres perigosos e path traversal
 */
function sanitizeFileName(fileName: string): string {
  if (!fileName) return '';
  
  // Remove path traversal e pega apenas o nome base
  const baseName = fileName.replace(/^.*[\\\/]/, '');
  
  // Remove caracteres perigosos, mantém apenas alfanuméricos, hífen, underscore e ponto
  const safe = baseName.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Remove múltiplos pontos consecutivos (previne ../)
  const noDots = safe.replace(/\.{2,}/g, '.');
  
  // Limita tamanho
  return noDots.substring(0, 100);
}

/**
 * Sanitiza category/productName removendo caracteres perigosos
 */
function sanitizePath(value: string): string {
  if (!value) return '';
  
  // Remove qualquer caractere que não seja alfanumérico, hífen ou underscore
  // Remove especialmente /, \, .., espaços
  return value
    .replace(/[\\\/\.]/g, '') // Remove barras e pontos
    .replace(/[^a-zA-Z0-9_-]/g, '_') // Substitui outros caracteres por underscore
    .substring(0, 50);
}

/**
 * Extrai e valida extensão do arquivo
 */
function getFileExtension(fileName: string): string | null {
  if (!fileName) return null;
  
  const match = fileName.toLowerCase().match(/\.[^.]+$/);
  if (!match) return null;
  
  const ext = match[0];
  return ALLOWED_EXTENSIONS.includes(ext) ? ext : null;
}

/**
 * Valida a key final antes do upload
 */
function validateKey(key: string): boolean {
  if (!key) return false;
  
  // Não pode conter path traversal
  if (key.includes('..')) return false;
  
  // Não pode conter barras duplas
  if (key.includes('//')) return false;
  
  // Não pode começar com barra
  if (key.startsWith('/')) return false;
  
  // Deve ter extensão válida
  const ext = key.toLowerCase().match(/\.[^.]+$/);
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext[0])) return false;
  
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Validar e criar client S3
    const s3 = createS3Client();
    const bucketName = getS3Bucket();
    
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const category = formData.get("category") as string;
    const productName = formData.get("productName") as string;
    const uploadType = formData.get("uploadType") as string;
    
    // Validação 1: Arquivo existe
    if (!file || !file.name) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Validação 2: Tipo de upload válido
    if (!uploadType || !VALID_UPLOAD_TYPES.includes(uploadType)) {
      return NextResponse.json({ error: "Tipo de upload inválido" }, { status: 400 });
    }

    // Validação 3: MIME type
    if (!file.type || !ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: "Tipo de arquivo não permitido. Apenas imagens JPG, PNG, WEBP e GIF são aceitas." 
      }, { status: 400 });
    }

    // Validação 4: Extensão do arquivo
    const fileExtension = getFileExtension(file.name);
    if (!fileExtension) {
      return NextResponse.json({ 
        error: "Extensão de arquivo inválida ou não permitida." 
      }, { status: 400 });
    }

    // Validação 5: Tamanho do arquivo
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: "Arquivo muito grande. Tamanho máximo: 10MB" 
      }, { status: 400 });
    }

    // Gerar nome único e seguro
    const uniqueFileName = `${Date.now()}-${randomUUID()}${fileExtension}`;
    
    let key: string;
    
    if (uploadType === 'category') {
      // Imagens de categoria vão para categories/
      key = `categories/${uniqueFileName}`;
    } else {
      // Imagens de produto vão para {categoria}/{produto}/
      if (!category || !productName) {
        return NextResponse.json({ 
          error: "Categoria e nome do produto são obrigatórios" 
        }, { status: 400 });
      }
      
      // Sanitizar category e productName
      const sanitizedCategory = sanitizePath(category);
      const sanitizedProductName = sanitizePath(productName);
      
      if (!sanitizedCategory || !sanitizedProductName) {
        return NextResponse.json({ 
          error: "Categoria ou nome do produto inválidos" 
        }, { status: 400 });
      }
      
      key = `${sanitizedCategory}/${sanitizedProductName}/${uniqueFileName}`;
    }
    
    // Validação final da key
    if (!validateKey(key)) {
      return NextResponse.json({ 
        error: "Caminho de arquivo inválido" 
      }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadParams = {
      Bucket: bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    };

    const result = await s3.upload(uploadParams).promise();
    
    console.log(`✓ Upload realizado: ${key}`);
    
    return NextResponse.json({ url: result.Location });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json({ error: "Erro no upload" }, { status: 500 });
  }
}