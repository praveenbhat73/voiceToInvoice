'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/format';
import { calculateTotals } from '@/lib/invoice';
import { useDemoStore } from '@/store/demo-store';
import { StepHeading } from './step-heading';
import { useT } from '@/lib/i18n';

const CELL =
  'border-transparent bg-transparent px-2.5 py-2 hover:border-line focus:bg-surface';

const toNumber = (value: string) => Number.parseFloat(value) || 0;

export function StepLineItems() {
  const t = useT();
  const lineItems = useDemoStore((s) => s.lineItems);
  const taxRate = useDemoStore((s) => s.taxRate);
  const currency = useDemoStore((s) => s.currency);
  const addLineItem = useDemoStore((s) => s.addLineItem);
  const updateLineItem = useDemoStore((s) => s.updateLineItem);
  const removeLineItem = useDemoStore((s) => s.removeLineItem);
  const totals = calculateTotals(lineItems, taxRate);

  return (
    <div>
      <StepHeading title={t('lineTitle')}>
        These line items come from your actual voice note. Everything below is editable — add a row, delete a row, change a number.
      </StepHeading>

      <div className="max-w-[760px] overflow-x-auto">
        <table className="w-full min-w-[560px] border-collapse">
          <thead>
            <tr className="border-b border-line text-left font-mono text-[11.5px] text-muted">
              <th className="w-[44%] px-2.5 pb-2.5 font-medium">{t('description')}</th>
              <th className="px-2.5 pb-2.5 font-medium">{t('qty')}</th>
              <th className="px-2.5 pb-2.5 font-medium">{t('rate')}</th>
              <th className="px-2.5 pb-2.5 text-right font-medium">{t('amount')}</th>
              <th className="w-8">
                <span className="sr-only">Remove</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {lineItems.map((item) => (
              <tr key={item.id} className="border-b border-line">
                <td className="p-1.5">
                  <Input
                    aria-label={t('description')}
                    value={item.description}
                    onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
                    className={CELL}
                  />
                </td>
                <td className="w-16 p-1.5">
                  <Input
                    aria-label={t('qty')}
                    type="number"
                    min={0}
                    step={0.25}
                    value={item.quantity}
                    onChange={(e) => updateLineItem(item.id, { quantity: toNumber(e.target.value) })}
                    className={CELL}
                  />
                </td>
                <td className="w-24 p-1.5">
                  <Input
                    aria-label={t('rate')}
                    type="number"
                    min={0}
                    step={0.01}
                    value={item.rate}
                    onChange={(e) => updateLineItem(item.id, { rate: toNumber(e.target.value) })}
                    className={CELL}
                  />
                </td>
                <td className="w-[100px] p-1.5 text-right font-mono text-[14.5px]">
                  {formatCurrency(item.quantity * item.rate, currency)}
                </td>
                <td className="p-1.5">
                  <button
                    type="button"
                    onClick={() => removeLineItem(item.id)}
                    aria-label={`${t('remove')} ${item.description}`}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-muted hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Button variant="ghost" size="sm" className="mt-3.5" onClick={addLineItem}>
        <Plus className="h-4 w-4" /> {t('addItem')}
      </Button>

      <dl className="mt-5 flex max-w-[760px] flex-col items-end gap-2 font-mono text-[14.5px] text-ink-soft">
        <div className="flex w-[220px] justify-between">
          <dt>{t('subtotal')}</dt>
          <dd>{formatCurrency(totals.subtotal, currency)}</dd>
        </div>
        <div className="flex w-[220px] justify-between">
          <dt>{t('tax')} ({taxRate}%)</dt>
          <dd>{formatCurrency(totals.tax, currency)}</dd>
        </div>
        <div className="flex w-[220px] justify-between border-t border-line pt-2.5 text-xl font-semibold text-ink">
          <dt>{t('total')}</dt>
          <dd className="text-utility">{formatCurrency(totals.total, currency)}</dd>
        </div>
      </dl>
    </div>
  );
}
