import { z } from 'zod';

export const detailsSchema = z.object({
  clientName: z.string().trim().min(1, 'Client name is required'),
  clientAddress: z.string(),
  clientPhone: z.string(),
  businessName: z.string().trim().min(1, 'Business name is required'),
  businessPhone: z.string(),
  invoiceNumber: z.string().trim().min(1, 'Invoice number is required'),
  taxRate: z
    .number({ invalid_type_error: 'Enter a number' })
    .min(0, 'Cannot be negative')
    .max(30, 'Max 30%'),
});

export type DetailsFormValues = z.infer<typeof detailsSchema>;
