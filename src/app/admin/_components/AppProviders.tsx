'use client';

import { ReactNode } from 'react';
import ThemeProvider from './ThemeProvider';
import UiLangProvider from './UiLangProvider';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <UiLangProvider>
        {children}
      </UiLangProvider>
    </ThemeProvider>
  );
}
