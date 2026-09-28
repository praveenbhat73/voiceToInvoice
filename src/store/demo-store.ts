import { create } from 'zustand';
import { getJob, type JobId } from '@/data/jobs';
import { LAST_STEP } from '@/data/steps';
import { createInvoiceNumber } from '@/lib/invoice';
import { uid } from '@/lib/utils';
import type { BusinessDetails, ClientDetails, LineItem } from '@/types/invoice';
import { DEFAULT_VOICE_LANGUAGE } from '@/lib/languages';
import { DEFAULT_CURRENCY, type CurrencyCode } from '@/lib/currency';
import { parseVoiceToInvoice } from '@/lib/voice-to-invoice';

interface DemoData {
  step: number;
  maxStep: number;
  jobId: JobId | null;
  recorded: boolean;
  recordedSeconds: number;
  transcript: string;
  transcriptReady: boolean;
  lineItems: LineItem[];
  taxRate: number;
  invoiceNumber: string;
  client: ClientDetails;
  business: BusinessDetails;
  voiceLanguage: string;
  currency: CurrencyCode;
}

interface DemoState extends DemoData {
  isOpen: boolean;
}

interface DemoActions {
  openDemo: () => void;
  closeDemo: () => void;
  restart: () => void;
  selectJob: (id: JobId) => void;
  goToStep: (step: number) => void;
  next: () => void;
  back: () => void;
  markRecorded: (seconds: number) => void;
  setTranscript: (value: string) => void;
  setTranscriptReady: (ready: boolean) => void;
  addLineItem: () => void;
  updateLineItem: (id: string, patch: Partial<Omit<LineItem, 'id'>>) => void;
  removeLineItem: (id: string) => void;
  setClient: (client: ClientDetails) => void;
  setBusiness: (business: BusinessDetails) => void;
  setInvoiceNumber: (value: string) => void;
  setTaxRate: (value: number) => void;
  setVoiceLanguage: (value: string) => void;
  prepareInvoiceFromTranscript: () => void;
}

const createFreshData = (): DemoData => ({
  step: 0,
  maxStep: 0,
  jobId: null,
  recorded: false,
  recordedSeconds: 0,
  transcript: '',
  transcriptReady: false,
  lineItems: [],
  taxRate: 7,
  // Generated on open (client-side only) to avoid server/client hydration mismatches.
  invoiceNumber: '',
  client: { name: '', address: '', phone: '' },
  business: { name: '', phone: '' },
  voiceLanguage: DEFAULT_VOICE_LANGUAGE,
  currency: DEFAULT_CURRENCY,
});

export const canAdvance = (s: DemoData): boolean => {
  if (s.step === 0) return s.jobId !== null;
  if (s.step === 1) return s.recorded;
  return true;
};

export const useDemoStore = create<DemoState & DemoActions>((set, get) => ({
  ...createFreshData(),
  isOpen: false,

  openDemo: () => {
    const voiceLanguage = get().voiceLanguage;
    set({ ...createFreshData(), voiceLanguage, invoiceNumber: createInvoiceNumber(), isOpen: true });
  },
  closeDemo: () => set({ isOpen: false }),
  restart: () => {
    const voiceLanguage = get().voiceLanguage;
    set({ ...createFreshData(), voiceLanguage, invoiceNumber: createInvoiceNumber() });
  },

  selectJob: (id) => {
    const job = getJob(id);
    set({
      jobId: id,
      maxStep: 0,
      recorded: false,
      recordedSeconds: 0,
      transcript: '',
      transcriptReady: false,
      // Never preload demo line items. The invoice must be built from the user's actual speech.
      lineItems: [],
      client: { ...job.client },
      business: { ...job.business },
    });
  },

  goToStep: (step) => {
    const { maxStep } = get();
    if (step >= 0 && step <= maxStep) set({ step });
  },
  next: () => {
    const state = get();
    if (!canAdvance(state) || state.step >= LAST_STEP) return;
    if (state.step === 2) {
      const parsed = parseVoiceToInvoice(state.transcript);
      set({ lineItems: parsed.lineItems, currency: parsed.currency });
    }
    const step = state.step + 1;
    set({ step, maxStep: Math.max(state.maxStep, step) });
  },
  back: () => set((s) => ({ step: Math.max(0, s.step - 1) })),

  markRecorded: (seconds) => set({ recorded: true, recordedSeconds: seconds, transcriptReady: false }),
  setTranscript: (transcript) => set({ transcript }),
  setTranscriptReady: (transcriptReady) => set({ transcriptReady }),

  addLineItem: () =>
    set((s) => ({
      lineItems: [...s.lineItems, { id: uid(), description: 'New line item', quantity: 1, rate: 0 }],
    })),
  updateLineItem: (id, patch) =>
    set((s) => ({
      lineItems: s.lineItems.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    })),
  removeLineItem: (id) => set((s) => ({ lineItems: s.lineItems.filter((item) => item.id !== id) })),

  setClient: (client) => set({ client }),
  setBusiness: (business) => set({ business }),
  setInvoiceNumber: (invoiceNumber) => set({ invoiceNumber }),
  setTaxRate: (taxRate) => set({ taxRate }),
  setVoiceLanguage: (voiceLanguage) => set({ voiceLanguage }),
  prepareInvoiceFromTranscript: () => {
    const parsed = parseVoiceToInvoice(get().transcript);
    set({ lineItems: parsed.lineItems, currency: parsed.currency });
  },
}));
