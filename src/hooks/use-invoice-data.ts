'use client';

import { useMemo } from 'react';
import { buildInvoice } from '@/lib/invoice';
import { useDemoStore } from '@/store/demo-store';
import type { InvoiceData } from '@/types/invoice';

/** Derives the invoice from the demo store. Issue date is fixed per mount. */
export function useInvoiceData(): InvoiceData {
  const invoiceNumber = useDemoStore((s) => s.invoiceNumber);
  const client = useDemoStore((s) => s.client);
  const business = useDemoStore((s) => s.business);
  const lineItems = useDemoStore((s) => s.lineItems);
  const taxRate = useDemoStore((s) => s.taxRate);
  const currency = useDemoStore((s) => s.currency);
  const issuedOn = useMemo(() => new Date(), []);

  return useMemo(
    () => buildInvoice({ invoiceNumber, client, business, lineItems, taxRate, currency, issuedOn }),
    [invoiceNumber, client, business, lineItems, taxRate, currency, issuedOn],
  );
}
