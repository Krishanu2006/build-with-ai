import { 
  FilterState, 
  Hotspot, 
  GeographicArea, 
  ReferenceTaxonomy, 
  ProcessedRequest,
  CitizenRequest
} from '../types/domain';
import { mockDataStore } from './mockDataStore';

// Simulated latency helper to test realistic UI loading states (skeletons, spinners)
function delay<T>(data: T, ms = 120): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(data), ms));
}

export const api = {
  // API-001: Submit text request
  async submitText(params: {
    text: string;
    languageHint?: string;
    locationText?: string;
    areaId?: string;
  }): Promise<{ requestId: string; state: 'received' }> {
    const res = mockDataStore.submitRequest({
      channel: 'text',
      text: params.text,
      languageHint: params.languageHint,
      locationText: params.locationText,
      areaId: params.areaId
    });
    return delay(res, 200);
  },

  // API-002: Submit voice request
  async submitVoice(params: {
    audioBlob: Blob;
    languageHint?: string;
    locationText?: string;
    areaId?: string;
  }): Promise<{ requestId: string; state: 'received' }> {
    const res = mockDataStore.submitRequest({
      channel: 'voice',
      audioBlob: params.audioBlob,
      languageHint: params.languageHint,
      locationText: params.locationText,
      areaId: params.areaId
    });
    return delay(res, 300);
  },

  // API-003: Get request status and interpretation
  async getRequestStatus(requestId: string): Promise<{
    request?: CitizenRequest;
    processed?: ProcessedRequest;
  }> {
    const res = mockDataStore.getRequestStatus(requestId);
    return delay(res, 80);
  },

  // API-004: List filtered hotspots
  async getHotspots(filters: FilterState = {}): Promise<{
    hotspots: Hotspot[];
    totalRequests: number;
    matchingCount: number;
  }> {
    const res = mockDataStore.getHotspots(filters);
    return delay(res, 100);
  },

  // API-005 & API-006: Hotspot Detail & Evidence
  async getHotspotDetail(hotspotId: string): Promise<{
    hotspot?: Hotspot;
    contributingRequests: ProcessedRequest[];
  }> {
    const res = mockDataStore.getHotspotDetail(hotspotId);
    return delay(res, 120);
  },

  // API-007: Geographic areas and geometry
  async getAreas(): Promise<GeographicArea[]> {
    const res = mockDataStore.getAreas();
    return delay(res, 50);
  },

  // API-008: Reference Taxonomy
  async getTaxonomy(): Promise<ReferenceTaxonomy> {
    const res = mockDataStore.getTaxonomy();
    return delay(res, 50);
  },

  // Operational: Reset demo data
  resetDemoData() {
    mockDataStore.resetToSeed();
  }
};
