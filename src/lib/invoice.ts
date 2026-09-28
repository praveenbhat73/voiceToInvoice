import type {
  BusinessDetails,
  ClientDetails,
  InvoiceData,
  InvoiceTotals,
  LineItem,
} from '@/types/invoice';
import type { CurrencyCode } from '@/lib/currency';

export const PAYMENT_TERMS_DAYS = 14;

export function calculateTotals(items: LineItem[], taxRate: number): InvoiceTotals {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.rate, 0);
  const tax = subtotal * (taxRate / 100);
  return { subtotal, tax, total: subtotal + tax };
}

export function createInvoiceNumber(now: Date = new Date()): string {
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `INV-${now.getFullYear()}-${suffix}`;
}

export function addDays(date: Date, days: number): Date {
  const copy = new Date(date);
  copy.setDate(copy.getDate() + days);
  return copy;
}

interface BuildInvoiceInput {
  invoiceNumber: string;
  client: ClientDetails;
  business: BusinessDetails;
  lineItems: LineItem[];
  taxRate: number;
  currency: CurrencyCode;
  issuedOn?: Date;
}

export function buildInvoice(input: BuildInvoiceInput): InvoiceData {
  const issuedOn = input.issuedOn ?? new Date();
  return {
    invoiceNumber: input.invoiceNumber,
    issuedOn,
    dueOn: addDays(issuedOn, PAYMENT_TERMS_DAYS),
    client: input.client,
    business: input.business,
    lineItems: input.lineItems,
    taxRate: input.taxRate,
    currency: input.currency,
    totals: calculateTotals(input.lineItems, input.taxRate),
  };
}
