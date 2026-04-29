/**
 * Logger seguro para produção
 * Evita exposição de stack traces e informações sensíveis em logs
 */

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * Loga erro de forma segura
 * - Em development: loga erro completo para debug
 * - Em production: loga apenas mensagem genérica sem stack trace
 * 
 * NUNCA loga: body, headers, cookies, tokens, senhas, URI, AWS keys, JWT
 * 
 * @param context - Contexto do erro (ex: 'LOGIN', 'UPLOAD', 'PRODUCTS_CREATE')
 * @param error - Erro capturado
 */
export function logError(context: string, error: unknown): void {
  if (isDevelopment) {
    // Em desenvolvimento, logar tudo para facilitar debug
    console.error(`[${context}] Erro:`, error);
  } else {
    // Em produção, logar apenas mensagem segura sem stack trace
    if (error instanceof Error) {
      console.error(`[${context}] Erro: ${error.message}`);
    } else {
      console.error(`[${context}] Erro: ${typeof error}`);
    }
  }
}

/**
 * Loga informação de forma segura
 * - Em development: loga mensagem completa
 * - Em production: loga mensagem genérica sem detalhes sensíveis
 * 
 * @param context - Contexto da operação (ex: 'UPLOAD', 'S3_DELETE', 'PRODUCTS')
 * @param message - Mensagem a ser logada
 */
export function logInfo(context: string, message: string): void {
  if (isDevelopment) {
    // Em desenvolvimento, logar mensagem completa
    console.log(`[${context}] ${message}`);
  } else {
    // Em produção, logar apenas operação genérica
    console.log(`[${context}] Operação concluída`);
  }
}
