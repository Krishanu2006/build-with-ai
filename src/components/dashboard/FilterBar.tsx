import React from 'react';
import { Filter, X, Search } from 'lucide-react';
import { FilterState, ReferenceTaxonomy, GeographicArea, SeverityLevel } from '../../types/domain';
import { Select } from '../primitives/Select';

export interface FilterBarProps {
  filters: FilterState;
  taxonomy: ReferenceTaxonomy;
  areas: GeographicArea[];
  matchingCount: number;
  totalCount: number;
  onFilterChange: (next: FilterState) => void;
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  taxonomy,
  areas,
  matchingCount,
  totalCount,
  onFilterChange,
  onClearFilters,
}) => {
  const hasActiveFilters = Boolean(
    filters.category || filters.severity || filters.areaId || filters.search
  );

  const categoryOptions = [
    { value: '', label: 'All Civic Categories' },
    ...taxonomy.categories.map(c => ({ value: c.label, label: c.label })),
  ];

  const severityOptions = [
    { value: '', label: 'All Severities' },
    { value: 'high', label: 'High Severity Only' },
    { value: 'medium', label: 'Medium Severity Only' },
    { value: 'low', label: 'Low Severity Only' },
  ];

  const areaOptions = [
    { value: '', label: 'All Administrative Zones' },
    ...areas.map(a => ({ value: a.areaId, label: a.name })),
  ];

  return (
    <div className="bg-white border-b border-brand-border px-4 py-3 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Filter controls row */}
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-text-muted shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Filters:</span>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[160px] sm:min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={e => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="Search citizen requests..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-brand-surface-alt/60 border border-brand-border rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-focus"
            />
          </div>

          {/* Category Filter */}
          <div className="min-w-[150px]">
            <Select
              id="filter-category"
              options={categoryOptions}
              value={filters.category || ''}
              onChange={e => onFilterChange({ ...filters, category: e.target.value || undefined })}
              className="py-1.5 text-xs bg-brand-surface-alt/60"
              aria-label="Filter by Civic Category"
            />
          </div>

          {/* Severity Filter */}
          <div className="min-w-[130px]">
            <Select
              id="filter-severity"
              options={severityOptions}
              value={filters.severity || ''}
              onChange={e => onFilterChange({ ...filters, severity: (e.target.value as SeverityLevel) || undefined })}
              className="py-1.5 text-xs bg-brand-surface-alt/60"
              aria-label="Filter by Severity Level"
            />
          </div>

          {/* Area Filter */}
          <div className="min-w-[160px]">
            <Select
              id="filter-area"
              options={areaOptions}
              value={filters.areaId || ''}
              onChange={e => onFilterChange({ ...filters, areaId: e.target.value || undefined })}
              className="py-1.5 text-xs bg-brand-surface-alt/60"
              aria-label="Filter by Administrative Zone"
            />
          </div>

          {/* Clear action */}
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="flex items-center gap-1 text-xs text-brand-error hover:text-red-800 font-medium px-2 py-1 rounded bg-rose-50 border border-rose-200 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>

        {/* Results count badge */}
        <div className="flex items-center gap-2 self-start lg:self-center shrink-0">
          <span className="text-xs text-brand-text-muted">
            Displaying <strong className="text-brand-text tabular-nums">{matchingCount}</strong> of{' '}
            <span className="tabular-nums">{totalCount}</span> total citizen reports
          </span>
        </div>
      </div>
    </div>
  );
};
