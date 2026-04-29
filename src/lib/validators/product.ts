import { z } from 'zod';

/**
 * Schema para criação de produto (POST)
 */
export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome não pode ser vazio')
    .max(200, 'Nome muito longo'),
  
  description: z
    .string()
    .trim()
    .max(5000, 'Descrição muito longa')
    .optional(),
  
  category: z
    .string()
    .trim()
    .min(1, 'Categoria não pode ser vazia')
    .max(100, 'Categoria muito longa'),
  
  images: z
    .array(
      z.string()
        .min(1, 'URL de imagem não pode ser vazia')
        .max(2000, 'URL de imagem muito longa')
    )
    .max(20, 'Máximo de 20 imagens')
    .optional()
    .default([]),
  
  specifications: z
    .record(
      z.string(),
      z.union([
        z.string(),
        z.number(),
        z.boolean(),
        z.null()
      ])
    )
    .optional()
    .default({})
    .refine(
      (obj) => {
        const dangerousKeys = ['__proto__', 'constructor', 'prototype'];
        return !Object.keys(obj).some(key => dangerousKeys.includes(key));
      },
      { message: 'Especificações contêm propriedades inválidas' }
    )
    .refine(
      (obj) => {
        // Garantir que valores não sejam objetos/arrays/funções
        return Object.values(obj).every(val => {
          const type = typeof val;
          return type === 'string' || type === 'number' || type === 'boolean' || val === null;
        });
      },
      { message: 'Especificações contêm valores inválidos' }
    ),
});

/**
 * Schema para atualização de produto (PUT)
 */
export const updateProductSchema = createProductSchema.extend({
  activated: z.boolean().optional(),
  featured: z.boolean().optional(),
});

/**
 * Schema para validação de ObjectId
 */
export const objectIdSchema = z
  .string()
  .refine(
    (id) => /^[0-9a-fA-F]{24}$/.test(id),
    { message: 'ID inválido' }
  );
