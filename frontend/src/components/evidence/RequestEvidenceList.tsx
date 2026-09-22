import { ChevronDown, ChevronUp, Mic, Languages } from 'lucide-react';
import { ProcessedRequest } from '../../types/domain';
import { Badge } from '../primitives/Badge';
import { useState } from 'react';

export interface RequestEvidenceListProps {
  requests: ProcessedRequest[];
}

export const RequestEvidenceList: React.FC<RequestEvidenceListProps> = ({ requests }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showTranslations, setShowTranslations] = useState<Record<string, boolean>>({});

  const toggleTranslation = (id: string) => {
    setShowTranslations(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="border border-brand-border rounded-lg bg-white overflow-hidden shadow-level-1">
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        className="w-full p-3.5 bg-brand-surface-alt/70 hover:bg-brand-surface-alt flex items-center justify-between text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus"
      >
        <div className="space-y-0.5">
          <div className="text-xs font-semibold text-brand-primary uppercase tracking-wider">
            Underlying Citizen Feedback
          </div>
          <p className="text-xs text-brand-text font-medium">
            Inspect the {requests.length} citizen submissions aggregated in this hotspot
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-brand-text-muted shrink-0">
          <span>{isOpen ? 'Hide Submissions' : 'Show All'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="divide-y divide-brand-border max-h-[480px] overflow-y-auto">
          {requests.length === 0 ? (
            <p className="p-4 text-xs text-brand-text-muted text-center italic">
              No individual requests available for current filter view.
            </p>
          ) : (
            requests.map(req => {
              const isTranslatedView = showTranslations[req.id];
              const displayText = isTranslatedView && req.translationApplied
                ? req.normalizedText
                : req.originalText;

              return (
                <div key={req.id} className="p-3.5 space-y-2 hover:bg-slate-50/60 transition-colors">
                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-brand-text-muted text-[11px]">
                        {req.requestId}
                      </span>
                      <Badge variant="category" size="sm">
                        {req.category}
                      </Badge>
                      <Badge variant="severity" severity={req.severity} size="sm" />
                      {req.isTranscript && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                          <Mic className="w-2.5 h-2.5" /> Machine Transcript
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-brand-text-muted uppercase font-mono">
                        {req.language}
                      </span>
                      {req.translationApplied && (
                        <button
                          type="button"
                          onClick={() => toggleTranslation(req.id)}
                          className="flex items-center gap-1 text-[11px] text-brand-primary hover:text-brand-primary-hover font-medium underline"
                        >
                          <Languages className="w-3 h-3" />
                          <span>{isTranslatedView ? 'Show Original' : 'Translate to English'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Citizen Request Content */}
                  <p className="text-xs text-brand-text leading-relaxed font-normal bg-brand-surface-alt/40 p-2.5 rounded border border-brand-border/60">
                    {displayText}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-brand-text-muted pt-0.5">
                    <span>Specific Location: <strong>{req.location}</strong></span>
                    <span>Reported on: {new Date(req.processedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
