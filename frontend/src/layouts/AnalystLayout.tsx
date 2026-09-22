import React from 'react';
import { Header } from '../components/common/Header';
import { ProvenanceStrip } from '../components/common/ProvenanceStrip';

export const AnalystLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="h-screen flex flex-col bg-brand-background text-brand-text overflow-hidden">
      <Header />
      <ProvenanceStrip />
      <main id="main-content" className="flex-1 flex flex-col min-h-0 relative">
        {children}
      </main>
    </div>
  );
};
