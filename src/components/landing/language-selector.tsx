'use client';

import { ChevronDown, Languages } from 'lucide-react';
import { VOICE_LANGUAGES } from '@/lib/languages';
import { useDemoStore } from '@/store/demo-store';
import { useT } from '@/lib/i18n';

export function LanguageSelector() {
  const t = useT();
  const voiceLanguage = useDemoStore((s) => s.voiceLanguage);
  const setVoiceLanguage = useDemoStore((s) => s.setVoiceLanguage);
  const selected = VOICE_LANGUAGES.find((language) => language.code === voiceLanguage) ?? VOICE_LANGUAGES[0]!;

  return (
    <label className="relative flex items-center gap-2 rounded-full border border-line bg-canvas/80 px-3 py-2 text-[13px] font-medium text-ink-soft shadow-sm">
      <Languages className="h-4 w-4 text-brand" aria-hidden="true" />
      <span className="sr-only">{t('language')}</span>
      <select
        aria-label={t('language')}
        value={voiceLanguage}
        onChange={(event) => setVoiceLanguage(event.target.value)}
        className="max-w-[145px] appearance-none bg-transparent pr-5 outline-none"
      >
        {VOICE_LANGUAGES.map((language) => (
          <option key={language.code} value={language.code}>
            {language.nativeLabel} · {language.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5" aria-hidden="true" />
      <span className="sr-only">{selected.nativeLabel}</span>
    </label>
  );
}
