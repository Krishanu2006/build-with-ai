import React from 'react';
import { CandidateIntervention } from '../../types/domain';
import { Lightbulb, ShieldAlert, Sparkles, CheckSquare } from 'lucide-react';

export interface InterventionListProps {
  interventions: CandidateIntervention[];
  onSignalClick?: (signalKey: string) => void;
}

export const InterventionList: React.FC<InterventionListProps> = ({
  interventions,
  onSignalClick,
}) => {
  return (
    <div className="bg-white border border-brand-border rounded-lg shadow-level-1 p-4 space-y-4">
      {/* Advisory Header & Legal / Principle Guardrail Banner (DG-04, AC-016) */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-brand-secondary" />
          <h4 className="text-sm font-semibold text-brand-text">
            Candidate Interventions — Decision-Support Shortlist
          </h4>
        </div>

        <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-md text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="leading-relaxed">
            <strong>Advisory Notice:</strong> The platform surfaces candidate interventions as non-binding decision-support signals. The system does not commit funds, execute work orders, or replace administrative human judgment.
          </p>
        </div>
      </div>

      {/* Intervention Cards */}
      <div className="space-y-3">
        {interventions.length === 0 ? (
          <p className="p-4 text-xs text-brand-text-muted text-center italic border border-brand-border rounded">
            No candidate interventions formulated for this area.
          </p>
        ) : (
          interventions.map((item, idx) => (
            <div
              key={item.id}
              className="p-3.5 bg-brand-surface-alt/40 border border-brand-border rounded-lg space-y-2 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h5 className="text-sm font-semibold text-brand-text">
                  {idx + 1}. {item.title}
                </h5>
                <span
                  className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 flex items-center gap-1 ${
                    item.generationSource === 'ai'
                      ? 'bg-purple-50 text-purple-800 border-purple-200'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}
                >
                  {item.generationSource === 'ai' ? (
                    <>
                      <Sparkles className="w-3 h-3 text-purple-600" /> AI-Assisted Suggestion
                    </>
                  ) : (
                    <>
                      <CheckSquare className="w-3 h-3 text-blue-600" /> Curated Sector Rule
                    </>
                  )}
                </span>
              </div>

              <p className="text-xs text-brand-text leading-relaxed">
                {item.rationale}
              </p>

              {/* Linked Evidence Signals Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] text-brand-text-muted font-medium">Motivating Signals:</span>
                {item.linkedSignals.map(sig => (
                  <button
                    key={sig}
                    type="button"
                    onClick={() => onSignalClick?.(sig)}
                    className="text-[10px] font-mono bg-white border border-brand-border text-brand-primary hover:bg-brand-surface-alt px-2 py-0.5 rounded transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-focus"
                    title={`Derived from ${sig} aggregate`}
                  >
                    #{sig}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
