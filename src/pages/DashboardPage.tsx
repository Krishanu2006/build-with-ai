import { Map as MapIcon, List } from 'lucide-react';
import { AnalystLayout } from '../layouts/AnalystLayout';
import { FilterBar } from '../components/dashboard/FilterBar';
import { HotspotMap } from '../components/dashboard/HotspotMap';
import { HotspotList } from '../components/dashboard/HotspotList';
import { EvidencePanel } from '../components/evidence/EvidencePanel';
import { Spinner } from '../components/primitives/Spinner';
import { api } from '../services/api';
import { mockDataStore } from '../services/mockDataStore';
import {
  Hotspot,
  GeographicArea,
  ReferenceTaxonomy,
  FilterState,
  SeverityLevel,
  ProcessedRequest
} from '../types/domain';
import { useA11y } from '../context/A11yContext';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useState, useCallback, useEffect, useMemo } from 'react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { hotspotId: routeHotspotId } = useParams<{ hotspotId?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { announce } = useA11y();

  // Read filters from URL search params (FSD §6)
  const filters: FilterState = useMemo(() => ({
    category: searchParams.get('category') || undefined,
    severity: (searchParams.get('severity') as SeverityLevel) || undefined,
    areaId: searchParams.get('areaId') || undefined,
    search: searchParams.get('search') || undefined,
  }), [searchParams]);

  // Selected hotspot state (from route params or query)
  const selectedHotspotId = routeHotspotId || searchParams.get('selected') || undefined;

  // View mode for mobile / small viewports: 'map' | 'list'
  const [mobileTab, setMobileTab] = useState<'map' | 'list'>('list');

  // Server state
  const [taxonomy, setTaxonomy] = useState<ReferenceTaxonomy | null>(null);
  const [areas, setAreas] = useState<GeographicArea[]>([]);
  const [hotspotData, setHotspotData] = useState<{
    hotspots: Hotspot[];
    totalRequests: number;
    matchingCount: number;
  }>({ hotspots: [], totalRequests: 0, matchingCount: 0 });

  const [selectedDetail, setSelectedDetail] = useState<{
    hotspot?: Hotspot;
    contributingRequests: ProcessedRequest[];
  }>({ hotspot: undefined, contributingRequests: [] });

  const [loading, setLoading] = useState(true);

  // Load static reference metadata once
  useEffect(() => {
    Promise.all([api.getTaxonomy(), api.getAreas()])
      .then(([tax, ar]) => {
        setTaxonomy(tax);
        setAreas(ar);
      })
      .catch(err => console.error('Error loading metadata', err));
  }, []);

  // Fetch hotspots matching filters
  const loadHotspots = useCallback(async () => {
    try {
      const data = await api.getHotspots(filters);
      setHotspotData(data);
      announce(`Loaded ${data.hotspots.length} hotspots matching filters.`);
    } catch (err) {
      console.error('Error loading hotspots', err);
    } finally {
      setLoading(false);
    }
  }, [filters, announce]);

  useEffect(() => {
    loadHotspots();
  }, [loadHotspots]);

  // Subscribe to live mock data changes (e.g. when citizen submits a new request)
  useEffect(() => {
    const unsubscribe = mockDataStore.subscribe(() => {
      loadHotspots();
    });
    return unsubscribe;
  }, [loadHotspots]);

  // Load detail when selected hotspot changes
  useEffect(() => {
    if (selectedHotspotId) {
      api.getHotspotDetail(selectedHotspotId)
        .then(detail => {
          setSelectedDetail(detail);
          if (detail.hotspot) {
            announce(`Selected hotspot for ${detail.hotspot.areaName}. Rank ${detail.hotspot.rank} with ${detail.hotspot.requestCount} citizen reports.`);
          }
        })
        .catch(err => console.error('Error loading hotspot detail', err));
    } else {
      setSelectedDetail({ hotspot: undefined, contributingRequests: [] });
    }
  }, [selectedHotspotId, announce]);

  // Update filter query parameters in URL
  const handleFilterChange = (next: FilterState) => {
    const params = new URLSearchParams();
    if (next.category) params.set('category', next.category);
    if (next.severity) params.set('severity', next.severity);
    if (next.areaId) params.set('areaId', next.areaId);
    if (next.search) params.set('search', next.search);
    if (selectedHotspotId && !routeHotspotId) params.set('selected', selectedHotspotId);

    setSearchParams(params, { replace: true });
    announce(`Filters updated: ${next.category || 'all categories'}, ${next.severity || 'all severities'}.`);
  };

  const handleClearFilters = () => {
    const params = new URLSearchParams();
    if (selectedHotspotId && !routeHotspotId) params.set('selected', selectedHotspotId);
    setSearchParams(params, { replace: true });
    announce('Cleared all filters. Showing all civic areas.');
  };

  // Hotspot selection handlers (bidirectional sync between map and list)
  const handleSelectHotspot = (id: string) => {
    if (routeHotspotId) {
      navigate(`/dashboard/hotspot/${id}?${searchParams.toString()}`);
    } else {
      const params = new URLSearchParams(searchParams);
      params.set('selected', id);
      setSearchParams(params);
    }
  };

  const handleCloseDetail = () => {
    if (routeHotspotId) {
      navigate(`/dashboard?${searchParams.toString()}`);
    } else {
      const params = new URLSearchParams(searchParams);
      params.delete('selected');
      setSearchParams(params);
    }
    announce('Closed hotspot detail panel.');
  };

  return (
    <AnalystLayout>
      {/* 1. Global Filter Bar (FC-008 / DC-10) */}
      {taxonomy && (
        <FilterBar
          filters={filters}
          taxonomy={taxonomy}
          areas={areas}
          matchingCount={hotspotData.matchingCount}
          totalCount={hotspotData.totalRequests}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* 2. Mobile/Tablet View Switcher (<1024px) */}
      <div className="lg:hidden bg-white border-b border-brand-border px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-brand-text">View Mode:</span>
        <div className="flex items-center gap-1 bg-brand-surface-alt p-1 rounded-md">
          <button
            type="button"
            onClick={() => setMobileTab('list')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${mobileTab === 'list'
                ? 'bg-white text-brand-primary font-semibold shadow-sm'
                : 'text-brand-text-muted hover:text-brand-text'
              }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Ranked List</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${mobileTab === 'map'
                ? 'bg-white text-brand-primary font-semibold shadow-sm'
                : 'text-brand-text-muted hover:text-brand-text'
              }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Hotspot Map</span>
          </button>
        </div>
      </div>

      {/* 3. Main Dashboard Workspace (Map + List + Docked Detail Panel) */}
      <div className="flex-1 flex min-h-0 relative overflow-hidden">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3 bg-white">
            <Spinner size="lg" className="text-brand-primary" />
            <p className="text-sm font-semibold text-brand-text">
              Aggregating geographic civic demand signals...
            </p>
          </div>
        ) : (
          <>
            {/* Map Region (Left / Center) */}
            <div
              className={`flex-1 min-h-0 relative ${mobileTab === 'map' ? 'block w-full h-full' : 'hidden lg:block'
                }`}
            >
              <HotspotMap
                hotspots={hotspotData.hotspots}
                areas={areas}
                selectedHotspotId={selectedHotspotId}
                onSelectHotspot={handleSelectHotspot}
              />
            </div>

            {/* List / Docked Detail Region (Right Column, Desktop reference layout) */}
            <div
              className={`w-full lg:w-[440px] xl:w-[480px] bg-white border-l border-brand-border flex flex-col min-h-0 shrink-0 z-30 shadow-level-1 ${mobileTab === 'list' ? 'block' : 'hidden lg:flex'
                }`}
            >
              {selectedDetail.hotspot ? (
                /* Docked Hotspot Detail & Evidence Panel (SCR-004) */
                <EvidencePanel
                  hotspot={selectedDetail.hotspot}
                  contributingRequests={selectedDetail.contributingRequests}
                  onClose={handleCloseDetail}
                />
              ) : (
                /* Ranked Hotspot List (FC-010) */
                <div className="flex-1 overflow-y-auto">
                  <HotspotList
                    hotspots={hotspotData.hotspots}
                    selectedHotspotId={selectedHotspotId}
                    onSelectHotspot={handleSelectHotspot}
                    onClearFilters={handleClearFilters}
                  />
                </div>
              )}
            </div>

            {/* Mobile / Tablet Overlay Drawer when hotspot selected and tab was map */}
            {selectedDetail.hotspot && mobileTab === 'map' && (
              <div
                className="lg:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col justify-end"
                role="dialog"
                aria-modal="true"
              >
                <div className="bg-white rounded-t-2xl max-h-[85vh] h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom">
                  <EvidencePanel
                    hotspot={selectedDetail.hotspot}
                    contributingRequests={selectedDetail.contributingRequests}
                    onClose={handleCloseDetail}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AnalystLayout>
  );
};
