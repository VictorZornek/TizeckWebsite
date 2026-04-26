import { z } from 'zod';

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
