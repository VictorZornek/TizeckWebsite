import { z } from 'zod';
import { objectIdSchema } from '@/lib/validators/product';

/**
 * Schema para criação de categoria (POST)
 */
export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome não pode ser vazio')
    .max(100, 'Nome muito longo'),
  
  description: z
    .string()
    .trim()
    .max(1000, 'Descrição muito longa')
    .optional(),
  
  image: z
    .string()
    .max(2000, 'URL de imagem muito longa')
    .optional(),
});

/**
 * Schema para atualização de categoria (PUT)
 */
export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nome não pode ser vazio')
    .max(100, 'Nome muito longo'),
  
  description: z
    .string()
    .trim()
    .max(1000, 'Descrição muito longa')
    .optional(),
  
  image: z
    .string()
    .max(2000, 'URL de imagem muito longa')
    .optional(),
  
  activated: z
    .boolean()
    .optional(),
});

/**
 * Body para reordenar categorias (PATCH /api/categories/reorder)
 */
export const reorderCategoriesSchema = z.object({
  orderedIds: z
    .array(objectIdSchema)
    .min(1, 'A lista de categorias não pode ser vazia'),
});
