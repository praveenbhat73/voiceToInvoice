'use client';

import dynamic from 'next/dynamic';

// The demo is interaction-only, so it is loaded client-side and kept out of the initial bundle.
const DemoDialog = dynamic(() => import('./demo-dialog').then((m) => m.DemoDialog), {
  ssr: false,
});

export function DemoRoot() {
  return <DemoDialog />;
}
