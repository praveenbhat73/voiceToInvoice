import { formatCurrency, formatDate } from '@/lib/format';
import type { InvoiceData } from '@/types/invoice';

const LEFT = 48;
const RIGHT = 547;

/**
 * Builds and downloads the invoice PDF in the browser.
 * jsPDF is imported lazily so it stays out of the initial bundle.
 * Later: move this to a server route/action for consistent branding at scale.
 */
export async function downloadInvoicePdf(invoice: InvoiceData): Promise<void> {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  let y = 56;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(invoice.business.name || 'Your Business', LEFT, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(invoice.business.phone, LEFT, y + 16);
  doc.setFontSize(11);
  doc.text(invoice.invoiceNumber, RIGHT, y, { align: 'right' });
  doc.text(`Issued ${formatDate(invoice.issuedOn)}`, RIGHT, y + 16, { align: 'right' });
  doc.text(`Due ${formatDate(invoice.dueOn)}`, RIGHT, y + 30, { align: 'right' });

  y += 56;
  doc.setDrawColor(18, 19, 26);
  doc.line(LEFT, y, RIGHT, y);

  y += 26;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BILL TO', LEFT, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(invoice.client.name || 'Client name', LEFT, y + 16);
  doc.text(invoice.client.address, LEFT, y + 31);
  doc.text(invoice.client.phone, LEFT, y + 46);

  y += 76;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('DESCRIPTION', LEFT, y);
  doc.text('QTY', 380, y, { align: 'right' });
  doc.text('RATE', 460, y, { align: 'right' });
  doc.text('AMOUNT', RIGHT, y, { align: 'right' });
  y += 8;
  doc.line(LEFT, y, RIGHT, y);
  y += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  for (const item of invoice.lineItems) {
    const lines = doc.splitTextToSize(item.description, 300) as string[];
    doc.text(lines, LEFT, y);
    doc.text(String(item.quantity), 380, y, { align: 'right' });
    doc.text(formatCurrency(item.rate, invoice.currency), 460, y, { align: 'right' });
    doc.text(formatCurrency(item.quantity * item.rate, invoice.currency), RIGHT, y, { align: 'right' });
    y += 16 * lines.length + 6;
  }

  y += 10;
  doc.line(360, y, RIGHT, y);
  y += 20;
  doc.text('Subtotal', 460, y, { align: 'right' });
  doc.text(formatCurrency(invoice.totals.subtotal, invoice.currency), RIGHT, y, { align: 'right' });
  y += 18;
  doc.text(`Tax (${invoice.taxRate}%)`, 460, y, { align: 'right' });
  doc.text(formatCurrency(invoice.totals.tax, invoice.currency), RIGHT, y, { align: 'right' });
  y += 18;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text('Total due', 460, y, { align: 'right' });
  doc.text(formatCurrency(invoice.totals.total, invoice.currency), RIGHT, y, { align: 'right' });

  y += 40;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(120, 128, 140);
  doc.text('Thank you for the business. Payment due within 14 days of the issue date.', LEFT, y);

  doc.save(`${invoice.invoiceNumber}.pdf`);
}
