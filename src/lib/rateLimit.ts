/**
 * Rate Limiter em memória para proteção contra brute force
 * Usa cleanup preguiçoso (lazy cleanup) para remover entradas expiradas
 */

interface AttemptData {
  count: number;
  firstAttempt: number;
  blockedUntil?: number;
}

export class RateLimiter {
  private attempts = new Map<string, AttemptData>();
  private readonly windowMs: number;
  private readonly maxAttempts: number;
  private readonly blockDurationMs: number;

  constructor(options: {
    windowMs: number;
    maxAttempts: number;
    blockDurationMs: number;
  }) {
    this.windowMs = options.windowMs;
    this.maxAttempts = options.maxAttempts;
    this.blockDurationMs = options.blockDurationMs;
  }

  /**
   * Verifica se o IP pode fazer uma tentativa
   * Faz cleanup preguiçoso de entradas expiradas
   */
  check(ip: string): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const data = this.attempts.get(ip);

    // Cleanup preguiçoso: remover entradas muito antigas (> 1 hora)
    this.lazyCleanup(now);

    if (!data) {
      return { allowed: true };
    }

    // Verificar se está bloqueado
    if (data.blockedUntil && data.blockedUntil > now) {
      const retryAfter = Math.ceil((data.blockedUntil - now) / 1000);
      return { allowed: false, retryAfter };
    }

    // Limpar bloqueio expirado
    if (data.blockedUntil && data.blockedUntil <= now) {
      this.attempts.delete(ip);
      return { allowed: true };
    }

    // Verificar se a janela de tempo expirou
    if (now - data.firstAttempt > this.windowMs) {
      this.attempts.delete(ip);
      return { allowed: true };
    }

    // Verificar se excedeu o limite de tentativas
    if (data.count >= this.maxAttempts) {
      // Bloquear IP
      data.blockedUntil = now + this.blockDurationMs;
      const retryAfter = Math.ceil(this.blockDurationMs / 1000);
      return { allowed: false, retryAfter };
    }

    return { allowed: true };
  }

  /**
   * Incrementa o contador de tentativas para um IP
   */
  increment(ip: string): void {
    const now = Date.now();
    const data = this.attempts.get(ip);

    if (!data) {
      this.attempts.set(ip, {
        count: 1,
        firstAttempt: now,
      });
    } else {
      // Se a janela expirou, resetar
      if (now - data.firstAttempt > this.windowMs) {
        this.attempts.set(ip, {
          count: 1,
          firstAttempt: now,
        });
      } else {
        data.count++;
      }
    }
  }

  /**
   * Reseta o contador de tentativas para um IP (login bem-sucedido)
   */
  reset(ip: string): void {
    this.attempts.delete(ip);
  }

  /**
   * Cleanup preguiçoso: remove entradas antigas (> 1 hora)
   * Executado durante check() para evitar setInterval
   */
  private lazyCleanup(now: number): void {
    const oneHourAgo = now - 3600000; // 1 hora em ms

    for (const [ip, data] of this.attempts.entries()) {
      // Remover entradas muito antigas
      if (data.firstAttempt < oneHourAgo) {
        this.attempts.delete(ip);
      }
    }
  }

  /**
   * Retorna estatísticas do rate limiter (para debug)
   */
  getStats(): { totalIPs: number; blockedIPs: number } {
    const now = Date.now();
    let blockedCount = 0;

    for (const data of this.attempts.values()) {
      if (data.blockedUntil && data.blockedUntil > now) {
        blockedCount++;
      }
    }

    return {
      totalIPs: this.attempts.size,
      blockedIPs: blockedCount,
    };
  }
}

/**
 * Instância global do rate limiter para login
 * 5 tentativas em 10 minutos, bloqueio de 5 minutos
 */
export const loginRateLimiter = new RateLimiter({
  windowMs: 10 * 60 * 1000,       // 10 minutos
  maxAttempts: 5,                  // 5 tentativas
  blockDurationMs: 5 * 60 * 1000,  // Bloquear por 5 minutos
});

/**
 * Extrai o IP do cliente da requisição
 * Suporta x-forwarded-for (Vercel, Cloudflare, proxies)
 */
export function getClientIp(request: Request): string {
  // Tentar x-forwarded-for (Vercel, Cloudflare, proxies)
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Pegar o primeiro IP da lista (cliente original)
    return forwardedFor.split(',')[0].trim();
  }

  // Tentar x-real-ip (alguns proxies)
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  // Fallback para desenvolvimento local
  return 'unknown';
}
