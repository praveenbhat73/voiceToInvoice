export interface VoiceLanguage {
  code: string;
  label: string;
  nativeLabel: string;
}

// Browser speech-recognition support varies by browser. These are common BCP-47
// locales that can be selected when the browser exposes them.
export const VOICE_LANGUAGES: readonly VoiceLanguage[] = [
  { code: 'en-US', label: 'English', nativeLabel: 'English' },
  { code: 'hi-IN', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'kn-IN', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ' },
  { code: 'ta-IN', label: 'Tamil', nativeLabel: 'தமிழ்' },
  { code: 'te-IN', label: 'Telugu', nativeLabel: 'తెలుగు' },
  { code: 'ml-IN', label: 'Malayalam', nativeLabel: 'മലയാളം' },
  { code: 'mr-IN', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'bn-IN', label: 'Bengali', nativeLabel: 'বাংলা' },
  { code: 'gu-IN', label: 'Gujarati', nativeLabel: 'ગુજરાતી' },
  { code: 'pa-IN', label: 'Punjabi', nativeLabel: 'ਪੰਜਾਬੀ' },
  { code: 'es-ES', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'fr-FR', label: 'French', nativeLabel: 'Français' },
  { code: 'de-DE', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'pt-BR', label: 'Portuguese', nativeLabel: 'Português' },
  { code: 'it-IT', label: 'Italian', nativeLabel: 'Italiano' },
  { code: 'ja-JP', label: 'Japanese', nativeLabel: '日本語' },
  { code: 'ko-KR', label: 'Korean', nativeLabel: '한국어' },
  { code: 'zh-CN', label: 'Chinese', nativeLabel: '中文' },
  { code: 'ar-SA', label: 'Arabic', nativeLabel: 'العربية' },
] as const;

export const DEFAULT_VOICE_LANGUAGE = 'en-US';
