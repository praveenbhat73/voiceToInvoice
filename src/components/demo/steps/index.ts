import type { ComponentType } from 'react';
import { StepDetails } from './step-details';
import { StepJob } from './step-job';
import { StepLineItems } from './step-line-items';
import { StepRecord } from './step-record';
import { StepSend } from './step-send';
import { StepTranscript } from './step-transcript';

/** Order must match STEPS in src/data/steps.ts */
export const STEP_COMPONENTS: readonly ComponentType[] = [
  StepJob,
  StepRecord,
  StepTranscript,
  StepLineItems,
  StepDetails,
  StepSend,
];
