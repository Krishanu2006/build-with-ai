import React from 'react';
import { Hotspot } from '../../types/domain';
import { Badge } from '../primitives/Badge';
import { EmptyState } from '../primitives/EmptyState';
import { ChevronRight } from 'lucide-react';

export interface HotspotListProps {
  hotspots: Hotspot[];
  selectedHotspotId?: string;
  onSelectHotspot: (hotspotId: string) => void;
  onClearFilters?: () => void;
}

export const HotspotList: React.FC<HotspotListProps> = ({
  hotspots,
  selectedHotspotId,
  onSelectHotspot,
  onClearFilters,
}) => {
  if (hotspots.length === 0) {
    return (
      <EmptyState
        title="No Hotspots Match Active Filters"
        description="Try adjusting or clearing your category, severity, or search query to see other demand areas."
        actionLabel="Clear All Filters"
        onAction={onClearFilters}
        className="m-4"
      />
    );
  }

  return (
    <div
      id="hotspot-list-section"
      role="region"
      aria-label="Ranked Hotspot Demand List"
      className="divide-y divide-brand-border bg-white"
    >
      <div className="p-3 bg-brand-surface-alt/70 text-xs text-brand-text-muted flex items-center justify-between font-medium">
        <span>Ranked Administrative Areas</span>
        <span>{hotspots.length} Surfaced Areas</span>
      </div>

      <ul className="divide-y divide-brand-border list-none p-0 m-0" role="list">
        {hotspots.map(hotspot => {
          const isSelected = hotspot.id === selectedHotspotId;
          const { low, medium, high } = hotspot.severityDistribution;
          const total = hotspot.requestCount;

          return (
            <li key={hotspot.id} className="p-0 m-0">
              <button
                type="button"
                onClick={() => onSelectHotspot(hotspot.id)}
                aria-pressed={isSelected}
                className={`w-full text-left p-3.5 sm:p-4 transition-colors flex items-center justify-between gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus focus-visible:ring-inset ${
                  isSelected
                    ? 'bg-blue-50/80 border-l-4 border-l-brand-primary'
                    : 'hover:bg-brand-surface-alt/70 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Rank badge */}
                  <span
                    className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 tabular-nums ${
                      hotspot.rank <= 3
                        ? 'bg-brand-primary text-white shadow-sm'
                        : 'bg-brand-surface-alt text-brand-text border border-brand-border'
                    }`}
                  >
                    {hotspot.rank}
                  </span>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="text-sm font-semibold text-brand-text truncate">
                        {hotspot.areaName}
                      </h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-xs font-bold text-brand-primary tabular-nums">
                          {hotspot.requestCount}
                        </span>
                        <span className="text-[11px] text-brand-text-muted">reports</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="category" size="sm">
                        {hotspot.dominantCategory}
                      </Badge>
                      <span className="text-[11px] text-brand-text-muted">
                        Density: <strong className="text-brand-text tabular-nums">{hotspot.concentrationMeasure}</strong>/100k
                      </span>
                    </div>

                    {/* Mini severity distribution bar */}
                    <div className="space-y-0.5 pt-1">
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden flex" aria-hidden="true">
                        {high > 0 && (
                          <div
                            style={{ width: `${(high / total) * 100}%` }}
                            className="bg-brand-primary h-full"
                            title={`High: ${high}`}
                          />
                        )}
                        {medium > 0 && (
                          <div
                            style={{ width: `${(medium / total) * 100}%` }}
                            className="bg-[#5789B3] h-full"
                            title={`Medium: ${medium}`}
                          />
                        )}
                        {low > 0 && (
                          <div
                            style={{ width: `${(low / total) * 100}%` }}
                            className="bg-[#B9CFE3] h-full"
                            title={`Low: ${low}`}
                          />
                        )}
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-brand-text-muted font-mono tabular-nums">
                        <span>High: {high}</span>
                        <span>Med: {medium}</span>
                        <span>Low: {low}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform ${
                    isSelected ? 'text-brand-primary translate-x-0.5' : 'text-gray-400'
                  }`}
                  aria-hidden="true"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
