import React, { useRef } from 'react';
import { X, Share2, HelpCircle, AlertOctagon, Check } from 'lucide-react';
import { Hotspot, ProcessedRequest } from '../../types/domain';
import { DistributionCharts } from './DistributionCharts';
import { RequestEvidenceList } from './RequestEvidenceList';
import { ContextPanel } from './ContextPanel';
import { InterventionList } from './InterventionList';
import { useToast } from '../../context/ToastContext';

export interface EvidencePanelProps {
  hotspot: Hotspot;
  contributingRequests: ProcessedRequest[];
  onClose: () => void;
}

export const EvidencePanel: React.FC<EvidencePanelProps> = ({
  hotspot,
  contributingRequests,
  onClose,
}) => {
  const { addToast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const signalsRef = useRef<HTMLDivElement>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    addToast('Deep link to this hotspot copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSignalClick = (_signalKey: string) => {
    if (signalsRef.current) {
      signalsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      role="region"
      aria-label={`Hotspot Detail and Evidence for ${hotspot.areaName}`}
      className="h-full flex flex-col bg-brand-background text-brand-text overflow-hidden"
    >
      {/* Panel Sticky Header */}
      <div className="bg-white border-b border-brand-border p-4 sticky top-0 z-20 flex items-center justify-between gap-3 shadow-sm">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-brand-primary text-white px-2 py-0.5 rounded tabular-nums">
              Rank #{hotspot.rank}
            </span>
            <span className="text-xs text-brand-text-muted">
              {hotspot.requestCount} citizen reports
            </span>
          </div>
          <h2 className="text-lg font-bold text-brand-text truncate">
            {hotspot.areaName}
          </h2>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            className="p-2 text-brand-text-muted hover:text-brand-text border border-brand-border rounded bg-white hover:bg-brand-surface-alt transition-colors"
            title="Copy shareable link to this hotspot"
            aria-label="Copy shareable link"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-brand-text-muted hover:text-brand-text border border-brand-border rounded bg-white hover:bg-brand-surface-alt transition-colors"
            title="Close detail panel"
            aria-label="Close detail panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Panel Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
        
        {/* 1. "Why this region?" Section (FR-012, DG-01, DG-02) */}
        <section
          ref={signalsRef}
          aria-labelledby="why-this-region-heading"
          className="bg-white border border-brand-border rounded-xl p-5 shadow-level-1 space-y-5"
        >
          <div className="border-b border-brand-border pb-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-brand-primary" aria-hidden="true" />
              <h3 id="why-this-region-heading" className="text-base font-bold text-brand-text">
                Why this region?
              </h3>
            </div>
            <p className="text-xs text-brand-text-muted mt-1 leading-relaxed">
              Every observable signal contributing to this hotspot's demand ranking is explicitly enumerated below. No opaque composite AI scores.
            </p>
          </div>

          {/* Observable Signals Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-brand-text-muted uppercase tracking-wider">
              Observable Signals Computed
            </h4>
            <div className="divide-y divide-brand-border border border-brand-border rounded-lg overflow-hidden text-xs">
              {hotspot.evidence.signalsUsed.map(signal => (
                <div
                  key={signal.key}
                  className="p-3 flex items-start justify-between gap-3 bg-white hover:bg-brand-surface-alt/40 transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-brand-text block">
                      {signal.label}
                    </span>
                    {signal.description && (
                      <span className="text-[11px] text-brand-text-muted block">
                        {signal.description}
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-sm text-brand-primary font-mono tabular-nums block">
                      {signal.value}
                    </span>
                    {signal.unit && (
                      <span className="text-[10px] text-brand-text-muted font-medium block">
                        {signal.unit}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recharts Visualizations */}
          <DistributionCharts
            categories={hotspot.categoryBreakdown}
            severity={hotspot.severityDistribution}
          />

          {/* Signals Not Available Box (Mandatory per AC-013, AC-015, DG-03) */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
              <AlertOctagon className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
              <span>Unavailable / Unverified Signals</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Honest transparency: the following contextual indicators are currently not accessible or require institutional verification for this area.
            </p>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-amber-900 pt-1">
              {hotspot.evidence.unavailableSignals.map(sig => (
                <li key={sig.key} className="leading-snug">
                  <strong>{sig.label}:</strong> {sig.reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Method line */}
          <div className="pt-2 border-t border-brand-border/60 text-[11px] text-brand-text-muted flex flex-wrap items-center justify-between gap-2">
            <span>Algorithm: {hotspot.evidence.method.algorithm}</span>
            <span>Version: {hotspot.evidence.method.algorithmVersion}</span>
          </div>
        </section>

        {/* 2. Contributing Citizen Requests Disclosure (FC-015 / DC-18) */}
        <section aria-label="Contributing Citizen Submissions">
          <RequestEvidenceList requests={contributingRequests} />
        </section>

        {/* 3. Contextual Indicators & Provenance (FC-013 / DC-16) */}
        <section aria-label="Demographic & Infrastructure Context">
          <ContextPanel indicators={hotspot.context} />
        </section>

        {/* 4. Candidate Interventions (FC-014 / DC-17) */}
        <section aria-label="Candidate Interventions">
          <InterventionList
            interventions={hotspot.interventions}
            onSignalClick={handleSignalClick}
          />
        </section>

      </div>
    </div>
  );
};
