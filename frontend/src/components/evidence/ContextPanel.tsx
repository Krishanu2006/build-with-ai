import React from 'react';
import { ContextIndicator } from '../../types/domain';
import { ProvenanceTag } from '../primitives/ProvenanceTag';
import { Layers } from 'lucide-react';

export interface ContextPanelProps {
  indicators: ContextIndicator[];
}

export const ContextPanel: React.FC<ContextPanelProps> = ({ indicators }) => {
  return (
    <div className="bg-white border border-brand-border rounded-lg shadow-level-1 overflow-hidden space-y-3 p-4">
      <div className="flex items-center justify-between border-b border-brand-border pb-2.5">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-secondary" />
          <h4 className="text-sm font-semibold text-brand-text">
            Contextual Overlay & Provenance
          </h4>
        </div>
        <span className="text-[11px] text-brand-text-muted">
          Demographics & Infrastructure
        </span>
      </div>

      <p className="text-xs text-brand-text-muted leading-relaxed">
        Citizen demand is evaluated alongside baseline Census and municipal indicators. Every metric displays its explicit provenance and verification status.
      </p>

      {/* Indicators List */}
      <div className="divide-y divide-brand-border border border-brand-border rounded-md overflow-hidden text-xs">
        {indicators.map(indicator => {
          const isUnavailable = indicator.provenance === 'unavailable';

          return (
            <div
              key={indicator.key}
              className={`p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                isUnavailable ? 'bg-amber-50/40' : 'bg-white hover:bg-brand-surface-alt/40'
              } transition-colors`}
            >
              <div className="space-y-0.5 max-w-sm">
                <div className="font-semibold text-brand-text flex items-center gap-2">
                  <span>{indicator.label}</span>
                </div>
                {indicator.note && (
                  <p className="text-[11px] text-brand-text-muted leading-tight">
                    {indicator.note}
                  </p>
                )}
                <div className="text-[10px] text-brand-text-muted/80">
                  Source: {indicator.source} {indicator.vintage && `(${indicator.vintage})`}
                </div>
              </div>

              <div className="flex sm:flex-col sm:items-end justify-between items-center gap-1.5 shrink-0">
                {isUnavailable ? (
                  <span className="text-xs font-semibold text-amber-900 italic">
                    Not available for this area
                  </span>
                ) : (
                  <span className="text-sm font-bold text-brand-primary tabular-nums font-mono">
                    {indicator.value}{indicator.unit ? ` ${indicator.unit}` : ''}
                  </span>
                )}
                <ProvenanceTag provenance={indicator.provenance} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
