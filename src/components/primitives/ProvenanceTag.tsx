import React from 'react';
import { ProvenanceType } from '../../types/domain';

export interface ProvenanceTagProps {
  provenance: ProvenanceType;
  customLabel?: string;
  className?: string;
}

export const ProvenanceTag: React.FC<ProvenanceTagProps> = ({
  provenance,
  customLabel,
  className = '',
}) => {
  if (provenance === 'public') {
    return (
      <span className={`inline-flex items-center text-[11px] font-medium text-brand-text-muted border border-brand-border bg-white px-2 py-0.5 rounded-full ${className}`}>
        {customLabel || 'Public Data'}
      </span>
    );
  }

  if (provenance === 'synthetic') {
    return (
      <span className={`inline-flex items-center text-[11px] font-medium text-brand-text-muted border border-dashed border-brand-border bg-white px-2 py-0.5 rounded-full ${className}`}>
        {customLabel || 'Synthetic (Demo)'}
      </span>
    );
  }

  if (provenance === 'curated') {
    return (
      <span className={`inline-flex items-center text-[11px] font-medium text-brand-warning border border-amber-300 bg-amber-50/60 px-2 py-0.5 rounded-full ${className}`}>
        {customLabel || 'Curated / Mock'}
      </span>
    );
  }

  // Unavailable
  return (
    <span className={`inline-flex items-center text-[11px] font-medium italic text-amber-800 bg-amber-100/70 border border-amber-300 px-2 py-0.5 rounded-full ${className}`}>
      {customLabel || 'TBD / requires verification'}
    </span>
  );
};
