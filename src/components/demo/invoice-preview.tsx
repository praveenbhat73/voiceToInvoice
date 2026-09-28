'use client';

import { useInvoiceData } from '@/hooks/use-invoice-data';
import { formatCurrency, formatDate } from '@/lib/format';
import { useT } from '@/lib/i18n';

export function InvoicePreview() {
  const t = useT();
  const invoice = useInvoiceData();
  const { client, business, totals } = invoice;

  return (
    <article className="max-w-[720px] rounded-card bg-surface p-11 shadow-card max-sm:p-6">
      <header className="flex items-start justify-between gap-4 border-b border-line pb-5 max-sm:flex-col">
        <div>
          <p className="font-display text-[23px] font-bold">{business.name || t('businessName')}</p>
          <p className="mt-1 text-[13px] text-muted">{business.phone}</p>
        </div>
        <div className="text-right font-mono text-[12.5px] text-muted max-sm:text-left">
          <p className="text-base font-semibold text-ink">{invoice.invoiceNumber}</p>
          <p className="mt-1.5">{t('issued')} {formatDate(invoice.issuedOn)}</p>
          <p>{t('due')} {formatDate(invoice.dueOn)}</p>
        </div>
      </header>

      <section className="my-6">
        <h3 className="mb-2 font-mono text-[11px] font-medium text-muted">{t('billTo')}</h3>
        <p className="text-sm leading-relaxed">
          <strong>{client.name || t('clientName')}</strong>
          <br />
          {client.address}
          <br />
          {client.phone}
        </p>
      </section>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-line font-mono text-[11.5px] font-medium text-muted">
              <th className="px-1.5 py-2 text-left font-medium">{t('description')}</th>
              <th className="px-1.5 py-2 text-right font-medium">{t('qty')}</th>
              <th className="px-1.5 py-2 text-right font-medium">{t('rate')}</th>
              <th className="px-1.5 py-2 text-right font-medium">{t('amount')}</th>
            </tr>
          </thead>
          <tbody>
            {invoice.lineItems.map((item) => (
              <tr key={item.id} className="border-b border-line">
                <td className="px-1.5 py-3">{item.description}</td>
                <td className="px-1.5 py-3 text-right font-mono">{item.quantity}</td>
                <td className="px-1.5 py-3 text-right font-mono">{formatCurrency(item.rate, invoice.currency)}</td>
                <td className="px-1.5 py-3 text-right font-mono">
                  {formatCurrency(item.quantity * item.rate, invoice.currency)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <dl className="mt-4 flex flex-col items-end gap-1.5 font-mono text-[13.5px] text-ink-soft">
        <div className="flex w-[220px] justify-between">
          <dt>{t('subtotal')}</dt>
          <dd>{formatCurrency(totals.subtotal, invoice.currency)}</dd>
        </div>
        <div className="flex w-[220px] justify-between">
          <dt>{t('tax')} ({invoice.taxRate}%)</dt>
          <dd>{formatCurrency(totals.tax, invoice.currency)}</dd>
        </div>
        <div className="flex w-[220px] justify-between border-t border-line pt-2.5 text-[21px] font-bold text-ink">
          <dt>{t('totalDue')}</dt>
          <dd>{formatCurrency(totals.total, invoice.currency)}</dd>
        </div>
      </dl>

      <p className="mt-8 border-t border-line pt-4 text-[12.5px] text-muted">
        {t('thankYou')} {t('paymentDue')}
      </p>
    </article>
  );
}
