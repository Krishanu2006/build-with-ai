import React from 'react';
import { Header } from '../components/common/Header';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-brand-background text-brand-text">
      <Header />
      <main id="main-content" className="flex-1 py-8 px-4 sm:px-6">
        <div className="max-w-[var(--container-narrow)] mx-auto">
          {children}
        </div>
      </main>
      <footer className="py-6 px-4 border-t border-brand-border text-center text-xs text-brand-text-muted bg-white">
        <p>
          CivicSignal &copy; 2026 — Multilingual Civic Intelligence. A decision-support platform for public-sector planning.
        </p>
      </footer>
    </div>
  );
};
