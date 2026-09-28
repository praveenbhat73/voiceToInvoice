'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useMemo, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { detailsSchema, type DetailsFormValues } from '@/lib/schemas';
import { useDemoStore } from '@/store/demo-store';
import { StepHeading } from './step-heading';
import { useT } from '@/lib/i18n';

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="mb-3.5">
      <label className="mb-1.5 block text-[12.5px] font-medium text-muted">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function StepDetails() {
  const t = useT();
  const setClient = useDemoStore((s) => s.setClient);
  const setBusiness = useDemoStore((s) => s.setBusiness);
  const setInvoiceNumber = useDemoStore((s) => s.setInvoiceNumber);
  const setTaxRate = useDemoStore((s) => s.setTaxRate);

  const initialValues = useMemo(() => {
    const s = useDemoStore.getState();
    return {
      clientName: s.client.name,
      clientAddress: s.client.address,
      clientPhone: s.client.phone,
      businessName: s.business.name,
      businessPhone: s.business.phone,
      invoiceNumber: s.invoiceNumber,
      taxRate: s.taxRate,
    };
  }, []);

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<DetailsFormValues>({
    resolver: zodResolver(detailsSchema),
    mode: 'onChange',
    defaultValues: initialValues,
  });

  // Keep the store (and so the live invoice preview) in sync as the user types.
  useEffect(() => {
    const subscription = watch((v) => {
      setClient({ name: v.clientName ?? '', address: v.clientAddress ?? '', phone: v.clientPhone ?? '' });
      setBusiness({ name: v.businessName ?? '', phone: v.businessPhone ?? '' });
      setInvoiceNumber(v.invoiceNumber ?? '');
      setTaxRate(typeof v.taxRate === 'number' && Number.isFinite(v.taxRate) ? v.taxRate : 0);
    });
    return () => subscription.unsubscribe();
  }, [watch, setClient, setBusiness, setInvoiceNumber, setTaxRate]);

  return (
    <div>
      <StepHeading title={t('detailsTitle')}>
        {t('detailsBody')}
      </StepHeading>
      <form className="grid max-w-[820px] gap-9 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()} noValidate>
        <fieldset>
          <legend className="mb-3.5 font-mono text-[12.5px] text-muted">{t('billTo')}</legend>
          <Field label={t('clientName')} error={errors.clientName?.message}>
            <Input {...register('clientName')} autoComplete="off" />
          </Field>
          <Field label={t('address')}>
            <Input {...register('clientAddress')} autoComplete="off" />
          </Field>
          <Field label={t('phone')}>
            <Input {...register('clientPhone')} type="tel" autoComplete="off" />
          </Field>
        </fieldset>
        <fieldset>
          <legend className="mb-3.5 font-mono text-[12.5px] text-muted">{t('yourBusiness')}</legend>
          <Field label={t('businessName')} error={errors.businessName?.message}>
            <Input {...register('businessName')} autoComplete="off" />
          </Field>
          <Field label={t('phone')}>
            <Input {...register('businessPhone')} type="tel" autoComplete="off" />
          </Field>
          <div className="flex gap-3">
            <div className="flex-1">
              <Field label={t('invoiceNo')} error={errors.invoiceNumber?.message}>
                <Input {...register('invoiceNumber')} autoComplete="off" />
              </Field>
            </div>
            <div className="flex-1">
              <Field label={t('taxRate')} error={errors.taxRate?.message}>
                <Input
                  {...register('taxRate', { valueAsNumber: true })}
                  type="number"
                  min={0}
                  max={30}
                  step={0.5}
                />
              </Field>
            </div>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
