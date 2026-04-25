/**
 * Utilitário central para gerenciamento de JWT Secret
 * Garante que JWT_SECRET está configurado antes de usar
 */

/**
 * Obtém o JWT_SECRET do ambiente
 * @throws Error se JWT_SECRET não estiver configurado
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error(
      'JWT_SECRET não está configurado. Configure a variável de ambiente JWT_SECRET no arquivo .env'
    );
  }
  
  return secret;
}

/**
 * Obtém o JWT_SECRET codificado para uso com a biblioteca jose
 * @throws Error se JWT_SECRET não estiver configurado
 */
export function getJwtSecretEncoded(): Uint8Array {
  return new TextEncoder().encode(getJwtSecret());
}
