import type { BusinessDetails, ClientDetails, LineItemSeed } from '@/types/invoice';

export type JobId = 'plumbing' | 'electrical' | 'hvac' | 'handyman';

export interface Job {
  id: JobId;
  code: string;
  title: string;
  blurb: string;
  /** Stands in for real speech-to-text output. Replace with an API result later. */
  transcript: string;
  /** Stands in for real LLM extraction output. Replace with an API result later. */
  lineItems: LineItemSeed[];
  client: ClientDetails;
  business: BusinessDetails;
}

export const JOBS: readonly Job[] = [
  {
    id: 'plumbing',
    code: 'PL',
    title: 'Plumbing repair',
    blurb: 'Leaks, clogs, fixture swaps',
    transcript:
      'Replaced the kitchen sink P-trap and cleared a clog in the drain line. Used a new PVC P-trap kit and slip nuts. Took about an hour and a half including cleanup. Customer also asked about the garbage disposal — quoted that separately.',
    lineItems: [
      { description: 'Labor — drain clearing & P-trap replacement', quantity: 1.5, rate: 95 },
      { description: 'PVC P-trap kit + slip nuts', quantity: 1, rate: 22 },
      { description: 'Trip charge', quantity: 1, rate: 35 },
    ],
    client: { name: 'Karen Alvarez', address: '48 Birchwood Lane, Springfield', phone: '(555) 214-7788' },
    business: { name: 'Ramirez Plumbing & Drain', phone: '(555) 300-1122' },
  },
  {
    id: 'electrical',
    code: 'EL',
    title: 'Electrical install',
    blurb: 'Circuits, panels, fixtures',
    transcript:
      'Installed a new 20-amp breaker and ran a dedicated circuit out to the garage workbench. Also replaced two outlets in the hallway that were showing scorch marks. About two hours on site, plus breaker and wire.',
    lineItems: [
      { description: 'Labor — dedicated circuit install', quantity: 2, rate: 110 },
      { description: '20A breaker', quantity: 1, rate: 18 },
      { description: '12-gauge wire (50ft roll)', quantity: 1, rate: 34 },
      { description: 'Outlet replacement', quantity: 2, rate: 12 },
    ],
    client: { name: 'Devon Brooks', address: '212 Larkspur Court, Riverside', phone: '(555) 402-9981' },
    business: { name: 'Voltline Electric', phone: '(555) 771-4420' },
  },
  {
    id: 'hvac',
    code: 'HV',
    title: 'HVAC maintenance',
    blurb: 'Seasonal service, repairs',
    transcript:
      "Did the seasonal maintenance on the outdoor condenser unit — cleaned the coils, swapped the air filter, and checked refrigerant levels. Topped off about half a pound. Unit's running roughly ten degrees cooler now.",
    lineItems: [
      { description: 'Labor — seasonal maintenance & coil cleaning', quantity: 1, rate: 120 },
      { description: 'Air filter (20x25)', quantity: 1, rate: 16 },
      { description: 'Refrigerant top-off (0.5 lb)', quantity: 0.5, rate: 60 },
    ],
    client: { name: 'Priya Nair', address: '9 Copperfield Row, Meadowbrook', phone: '(555) 588-3010' },
    business: { name: 'CoolPoint HVAC Services', phone: '(555) 690-2244' },
  },
  {
    id: 'handyman',
    code: 'GH',
    title: 'General handyman',
    blurb: 'Repairs, mounting, patchwork',
    transcript:
      'Fixed a squeaky door hinge, patched a small drywall hole in the hallway, and mounted a TV bracket in the living room — customer supplied the bracket. About two hours total, start to finish.',
    lineItems: [
      { description: 'Labor — repairs & TV mount', quantity: 2, rate: 65 },
      { description: 'Drywall patch kit', quantity: 1, rate: 9 },
      { description: 'Hardware & fasteners', quantity: 1, rate: 6 },
    ],
    client: { name: 'Sam Whitfield', address: '77 Hollow Creek Drive, Fairview', phone: '(555) 233-9976' },
    business: { name: 'On-Call Handyman Services', phone: '(555) 812-3399' },
  },
];

export function getJob(id: JobId): Job {
  const job = JOBS.find((j) => j.id === id);
  if (!job) throw new Error(`Unknown job: ${id}`);
  return job;
}
