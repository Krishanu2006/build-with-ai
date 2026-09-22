import React from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

export const ProvenanceStrip: React.FC = () => {
  return (
    <aside
      aria-label="Dataset Provenance & Advisory Notice"
      className="bg-brand-surface-alt/90 border-b border-brand-border px-4 py-2 text-xs text-brand-text-muted flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-2">
        <Info className="w-3.5 h-3.5 text-brand-secondary shrink-0" aria-hidden="true" />
        <span>
          <strong className="font-semibold text-brand-text">Demonstration Environment:</strong> Displaying synthetic citizen requests joined with Census 2011 & OpenStreetMap indicators. <span className="text-amber-800 font-medium">Advisory decision-support only.</span>
        </span>
      </div>
      <Link
        to="/method"
        className="shrink-0 underline text-brand-primary hover:text-brand-primary-hover font-medium"
      >
        View data provenance & method &rarr;
      </Link>
    </aside>
  );
};
