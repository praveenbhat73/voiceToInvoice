export const STEPS = [
  { id: 'job', label: 'Pick a job' },
  { id: 'record', label: 'Record' },
  { id: 'transcript', label: 'Transcript' },
  { id: 'items', label: 'Line items' },
  { id: 'details', label: 'Details' },
  { id: 'send', label: 'Send it' },
] as const;

export const LAST_STEP = STEPS.length - 1;
