import { formatCurrency, formatDate } from '@/lib/format';
import type { InvoiceData } from '@/types/invoice';

export function buildWhatsAppUrl(invoice: InvoiceData): string {
  const message =
    `Hi ${invoice.client.name}, here's your invoice ${invoice.invoiceNumber} from ` +
    `${invoice.business.name} — total due ${formatCurrency(invoice.totals.total, invoice.currency)}, ` +
    `due ${formatDate(invoice.dueOn)}. Thanks for the business!`;
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

export function buildMailtoUrl(invoice: InvoiceData): string {
  const subject = `Invoice ${invoice.invoiceNumber} from ${invoice.business.name}`;
  const body =
    `Hi ${invoice.client.name},\n\n` +
    `Please find your invoice ${invoice.invoiceNumber} summarized below.\n\n` +
    `Total due: ${formatCurrency(invoice.totals.total, invoice.currency)}\n` +
    `Due date: ${formatDate(invoice.dueOn)}\n\n` +
    `Thanks for the business,\n${invoice.business.name}\n${invoice.business.phone}`;
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
