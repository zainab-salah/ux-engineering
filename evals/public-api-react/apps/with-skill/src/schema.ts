import { z } from 'zod';

const isHttpUrl = (value: string) => {
  try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
};

/** Validation for the product form. Values stay strings; `toPayload` converts at the API boundary. */
export const productFormSchema = z.object({
  title: z.string().trim().min(1, 'Enter a product name.').max(150, 'Use 150 characters or fewer.'),
  category: z.string().min(1, 'Choose a category.'),
  brand: z.string().trim().max(100, 'Use 100 characters or fewer.'),
  price: z.string().trim().min(1, 'Enter a price.')
    .regex(/^\d+(\.\d{1,2})?$/, 'Enter an amount like 19.99 (0 or more, up to two decimals).')
    .refine(value => Number(value) <= 999_999, 'Price must be 999,999 or less.'),
  stock: z.string().trim().min(1, 'Enter a stock quantity.')
    .regex(/^\d+$/, 'Use a whole number, 0 or more.')
    .refine(value => Number(value) <= 999_999, 'Stock must be 999,999 or less.'),
  sku: z.string().trim().max(100, 'Use 100 characters or fewer.'),
  description: z.string().trim().max(3000, 'Use 3,000 characters or fewer.'),
  thumbnail: z.string().trim().refine(value => !value || isHttpUrl(value), 'Use a link starting with https:// or http://.'),
});
