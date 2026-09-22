// Domain Entities defined in TAD.md (DE-001 to DE-008) and FSD.md

export type RequestChannel = 'text' | 'voice';

export type RequestState = 
  | 'received'
  | 'transcribed'
  | 'normalized'
  | 'extracted'
  | 'geolocated'
  | 'failed'
  | 'transcription_failed'
  | 'extraction_failed'
  | 'location_unresolved';

export type SeverityLevel = 'low' | 'medium' | 'high';

export type DataOrigin = 'live' | 'synthetic' | 'curated';

export type ProvenanceType = 'public' | 'synthetic' | 'curated' | 'unavailable';

// DE-001: CitizenRequest
export interface CitizenRequest {
  id: string;
  channel: RequestChannel;
  originalText?: string;
  audioBlobUrl?: string;
  transcript?: string;
  submittedLanguageHint?: string;
  locationText?: string;
  areaIdHint?: string;
  coordinates?: { lat: number; lng: number };
  state: RequestState;
  failureStage?: string;
  failureReason?: string;
  createdAt: string;
  dataOrigin: DataOrigin;
}

// DE-002: ProcessedRequest
export interface ProcessedRequest {
  id: string;
  requestId: string;
  language: string;
  originalText: string;
  normalizedText: string;
  translationApplied: boolean;
  category: string;
  issue: string;
  severity: SeverityLevel;
  location: string;
  areaId?: string;
  areaName?: string;
  geoResolution: 'area' | 'coordinates' | 'unresolved';
  themeId?: string;
  processedAt: string;
  isTranscript?: boolean;
}

// Category breakdown aggregate
export interface CategoryShare {
  category: string;
  count: number;
  share: number; // 0.0 to 1.0
}

// Severity distribution aggregate
export interface SeverityDistribution {
  low: number;
  medium: number;
  high: number;
}

// DE-005 & DE-006: Context Indicator
export interface ContextIndicator {
  key: string;
  label: string;
  value?: string | number;
  unit?: string;
  source: string;
  provenance: ProvenanceType;
  vintage?: string;
  note?: string;
}

// DE-007: Candidate Intervention
export interface CandidateIntervention {
  id: string;
  hotspotId: string;
  title: string;
  rationale: string;
  linkedSignals: string[];
  generationSource: 'ai' | 'curated';
}

// Evidence breakdown (FR-012)
export interface EvidenceSignal {
  key: string;
  label: string;
  value: string | number;
  unit?: string;
  description?: string;
}

export interface UnavailableSignal {
  key: string;
  label: string;
  reason: string;
}

export interface HotspotEvidence {
  signalsUsed: EvidenceSignal[];
  unavailableSignals: UnavailableSignal[];
  method: {
    algorithm: string;
    algorithmVersion: string;
    timeWindow: string;
  };
}

// DE-003: Hotspot
export interface Hotspot {
  id: string;
  areaId: string;
  areaName: string;
  rank: number;
  requestCount: number;
  dominantCategory: string;
  categoryBreakdown: CategoryShare[];
  severityDistribution: SeverityDistribution;
  concentrationMeasure: number; // e.g. requests per 10k population or density
  timeWindow: string;
  contributingRequestIds: string[];
  context: ContextIndicator[];
  evidence: HotspotEvidence;
  interventions: CandidateIntervention[];
  generatedAt: string;
  algorithmVersion: string;
  centroid: [number, number]; // [lat, lng]
}

// DE-004: GeographicArea
export interface GeographicArea {
  areaId: string;
  name: string;
  adminLevel: string;
  centroid: [number, number]; // [lat, lng]
  geometry?: GeoJSON.Polygon | GeoJSON.MultiPolygon;
  population?: number;
}

// DE-008: Reference Taxonomy
export interface TaxonomyItem {
  code: string;
  label: string;
  nativeLabel?: string;
  description?: string;
}

export interface ReferenceTaxonomy {
  languages: TaxonomyItem[];
  categories: TaxonomyItem[];
  severities: TaxonomyItem[];
}

// Dashboard Filters
export interface FilterState {
  category?: string;
  severity?: SeverityLevel;
  areaId?: string;
  timeWindow?: string;
  search?: string;
}

export interface FilterOptions {
  categories: TaxonomyItem[];
  severities: TaxonomyItem[];
  areas: { areaId: string; name: string }[];
}

// App Error Envelope
export interface AppError {
  kind: 'validation' | 'network' | 'notFound' | 'ai' | 'geocoding' | 'unknown';
  message: string;
  fields?: Record<string, string>;
  retryable?: boolean;
}
