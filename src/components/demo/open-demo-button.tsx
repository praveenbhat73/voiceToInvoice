'use client';

import { Button, type ButtonProps } from '@/components/ui/button';
import { useDemoStore } from '@/store/demo-store';

export function OpenDemoButton({ children, ...props }: Omit<ButtonProps, 'onClick'>) {
  const openDemo = useDemoStore((s) => s.openDemo);
  return (
    <Button onClick={openDemo} {...props}>
      {children}
    </Button>
  );
}
