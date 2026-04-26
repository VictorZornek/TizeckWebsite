import { Types } from 'mongoose';

/**
 * Valida se uma string é um ObjectId válido do MongoDB
 */
export function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id);
}

/**
 * Sanitiza nome para uso em paths S3
 * Remove caracteres especiais e espaços
 * Deve ser usado apenas ao montar paths/keys do S3
 */
export function sanitizePathName(name: string): string {
  return name
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^a-zA-Z0-9_-]/g, '');
}

/**
 * Valida se um objeto não contém propriedades perigosas
 * Bloqueia __proto__, constructor, prototype
 */
export function isSafeObject(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }
  
  const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
  const keys = Object.keys(obj);
  
  return !keys.some(key => dangerousKeys.includes(key));
}
