'use client';

import { Download, Mail, MessageCircle, RotateCcw, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useInvoiceData } from '@/hooks/use-invoice-data';
import { downloadInvoicePdf } from '@/lib/pdf';
import { buildMailtoUrl, buildWhatsAppUrl } from '@/lib/share';
import { useDemoStore } from '@/store/demo-store';
import { InvoicePreview } from '../invoice-preview';
import { StepHeading } from './step-heading';
import { useT } from '@/lib/i18n';

interface SendCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  primary?: boolean;
  loading?: boolean;
  onClick: () => void;
}

function SendCard({ icon: Icon, title, description, action, primary, loading, onClick }: SendCardProps) {
  return (
    <div className="min-w-[200px] flex-1 rounded-panel bg-surface p-[22px] shadow-card">
      <span className="mb-3.5 flex h-[38px] w-[38px] items-center justify-center rounded-[11px] bg-surface-muted">
        <Icon className="h-[18px] w-[18px]" />
      </span>
      <strong className="mb-1 block text-[15px]">{title}</strong>
      <span className="mb-3.5 block text-[13px] text-muted">{description}</span>
      <Button
        variant={primary ? 'primary' : 'ghost'}
        size="sm"
        block
        onClick={onClick}
        disabled={loading}
      >
        {action}
      </Button>
    </div>
  );
}

export function StepSend() {
  const t = useT();
  const invoice = useInvoiceData();
  const restart = useDemoStore((s) => s.restart);
  const [generating, setGenerating] = useState(false);

  const handlePdf = async () => {
    setGenerating(true);
    try {
      await downloadInvoicePdf(invoice);
      toast.success('PDF downloaded');
    } catch {
      toast.error('Could not generate the PDF in this environment');
    } finally {
      setGenerating(false);
    }
  };

  const handleWhatsApp = () => {
    window.open(buildWhatsAppUrl(invoice), '_blank', 'noopener,noreferrer');
    toast('Opening WhatsApp with your invoice summary');
  };

  const handleEmail = () => {
    window.location.href = buildMailtoUrl(invoice);
    toast('Opening your email app');
  };

  return (
    <div>
      <StepHeading title={t('ready')}>
        {t('readyBody')}
      </StepHeading>
      <InvoicePreview />
      <div className="mt-6 flex max-w-[720px] flex-wrap gap-4">
        <SendCard
          icon={Download}
          title={t('downloadPdf')}
          description={t('pdfDesc')}
          action={generating ? t('generating') : t('downloadPdf')}
          primary
          loading={generating}
          onClick={handlePdf}
        />
        <SendCard
          icon={MessageCircle}
          title={t('whatsapp')}
          description={t('whatsappDesc')}
          action={t('openWhatsapp')}
          onClick={handleWhatsApp}
        />
        <SendCard
          icon={Mail}
          title={t('email')}
          description={t('emailDesc')}
          action={t('openEmail')}
          onClick={handleEmail}
        />
      </div>
      <Button variant="ghost" className="mt-7" onClick={restart}>
        <RotateCcw className="h-4 w-4" /> {t('startOver')}
      </Button>
    </div>
  );
}
