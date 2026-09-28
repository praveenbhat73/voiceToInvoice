export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

export type LineItemSeed = Omit<LineItem, 'id'>;

export interface ClientDetails {
  name: string;
  address: string;
  phone: string;
}

export interface BusinessDetails {
  name: string;
  phone: string;
}

export interface InvoiceTotals {
  subtotal: number;
  tax: number;
  total: number;
}

import type { CurrencyCode } from '@/lib/currency';

export interface InvoiceData {
  invoiceNumber: string;
  issuedOn: Date;
  dueOn: Date;
  client: ClientDetails;
  business: BusinessDetails;
  lineItems: LineItem[];
  taxRate: number;
  currency: CurrencyCode;
  totals: InvoiceTotals;
}
