import { z } from 'zod';

/**
 * Transforma string vazia em undefined
 */
const emptyStringToUndefined = z
  .string()
  .transform(val => val === '' ? undefined : val)
  .optional();

/**
 * Schema para paginação
 */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).catch(1),
  limit: z.coerce.number().int().min(1).max(100).catch(50),
});

/**
 * Schema para filtros de customers
 */
export const customersQuerySchema = paginationSchema.extend({
  search: emptyStringToUndefined.pipe(z.string().max(200).optional()),
  city: emptyStringToUndefined.pipe(z.string().max(100).optional()),
  state: emptyStringToUndefined.pipe(z.string().trim().max(2).optional()),
  blocked: emptyStringToUndefined.pipe(z.enum(['true', 'false']).optional()),
});

/**
 * Schema para filtros de orders
 */
export const ordersQuerySchema = paginationSchema.extend({
  search: emptyStringToUndefined.pipe(z.string().max(200).optional()),
  status: emptyStringToUndefined.pipe(z.string().max(50).optional()),
  dateFrom: emptyStringToUndefined.pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
  dateTo: emptyStringToUndefined.pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional()),
});

/**
 * Schema para filtros de employees
 */
export const employeesQuerySchema = paginationSchema.extend({
  search: emptyStringToUndefined.pipe(z.string().max(200).optional()),
  active: emptyStringToUndefined.pipe(z.enum(['true', 'false']).optional()),
});
