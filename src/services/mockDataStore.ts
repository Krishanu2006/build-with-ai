import { 
  CitizenRequest, 
  ProcessedRequest, 
  Hotspot, 
  GeographicArea, 
  ReferenceTaxonomy, 
  FilterState, 
  SeverityLevel,
  CategoryShare,
  SeverityDistribution
} from '../types/domain';
import { TAXONOMY } from './mockData/taxonomy';
import { GEOGRAPHIC_AREAS } from './mockData/areas';
import { getFullSeededDataset } from './mockData/requests';
import { getContextForArea } from './mockData/context';
import { getInterventionsForHotspot } from './mockData/interventions';

const CITIZEN_REQUESTS_KEY = 'civicsignal_citizen_requests';
const PROCESSED_REQUESTS_KEY = 'civicsignal_processed_requests';

class MockDataStore {
  private citizenRequests: CitizenRequest[] = [];
  private processedRequests: ProcessedRequest[] = [];
  private areas: GeographicArea[] = GEOGRAPHIC_AREAS;
  private taxonomy: ReferenceTaxonomy = TAXONOMY;
  private listeners: (() => void)[] = [];

  constructor() {
    this.init();
  }

  private init() {
    // Check localStorage
    const savedCitizen = localStorage.getItem(CITIZEN_REQUESTS_KEY);
    const savedProcessed = localStorage.getItem(PROCESSED_REQUESTS_KEY);

    if (savedCitizen && savedProcessed) {
      try {
        this.citizenRequests = JSON.parse(savedCitizen);
        this.processedRequests = JSON.parse(savedProcessed);
        return;
      } catch (e) {
        console.error('Failed to parse stored requests, resetting to seed data', e);
      }
    }

    // Seed default dataset
    this.processedRequests = getFullSeededDataset();
    this.citizenRequests = this.processedRequests.map(p => ({
      id: p.requestId,
      channel: p.isTranscript ? 'voice' : 'text',
      originalText: p.originalText,
      transcript: p.isTranscript ? p.originalText : undefined,
      submittedLanguageHint: p.language,
      locationText: p.location,
      areaIdHint: p.areaId,
      state: 'geolocated',
      createdAt: p.processedAt,
      dataOrigin: 'synthetic'
    }));

    this.save();
  }

  private save() {
    try {
      localStorage.setItem(CITIZEN_REQUESTS_KEY, JSON.stringify(this.citizenRequests));
      localStorage.setItem(PROCESSED_REQUESTS_KEY, JSON.stringify(this.processedRequests));
    } catch (e) {
      console.warn('Storage limit reached or localStorage disabled', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // --- API-008: Get Taxonomy ---
  public getTaxonomy(): ReferenceTaxonomy {
    return this.taxonomy;
  }

  // --- API-007: Get Areas & Geometry ---
  public getAreas(): GeographicArea[] {
    return this.areas;
  }

  // --- API-001 & API-002: Submit Request (Text or Voice) ---
  public submitRequest(params: {
    channel: 'text' | 'voice';
    text?: string;
    audioBlob?: Blob;
    languageHint?: string;
    locationText?: string;
    areaId?: string;
  }): { requestId: string; state: 'received' } {
    const numericId = Math.floor(10000 + Math.random() * 90000);
    const requestId = `REQ-2026-${numericId}`;
    const internalId = `req-user-${Date.now()}`;
    const now = new Date().toISOString();

    const newCitizenReq: CitizenRequest = {
      id: requestId,
      channel: params.channel,
      originalText: params.text || (params.channel === 'voice' ? '[Voice audio recorded]' : ''),
      submittedLanguageHint: params.languageHint,
      locationText: params.locationText,
      areaIdHint: params.areaId,
      state: 'received',
      createdAt: now,
      dataOrigin: 'live'
    };

    this.citizenRequests.unshift(newCitizenReq);
    this.save();

    // Trigger asynchronous processing pipeline simulation
    this.runPipeline(internalId, requestId, params);

    return { requestId, state: 'received' };
  }

  // Pipeline simulation (received -> transcribed -> normalized -> extracted -> geolocated)
  private runPipeline(internalId: string, requestId: string, params: {
    channel: 'text' | 'voice';
    text?: string;
    languageHint?: string;
    locationText?: string;
    areaId?: string;
  }) {
    setTimeout(() => {
      const citizenReq = this.citizenRequests.find(r => r.id === requestId);
      if (!citizenReq) return;

      // 1. Language detection & normalization
      let language = params.languageHint || 'en';
      let originalText = params.text || 'We are experiencing severe water shortage and unpaved road conditions.';
      
      // If voice, simulate realistic transcription
      if (params.channel === 'voice') {
        citizenReq.state = 'transcribed';
        if (language === 'kn') {
          originalText = params.text || 'ನಮ್ಮ ಬಡಾವಣೆಯಲ್ಲಿ ಕುಡಿಯುವ ನೀರಿನ ಸಮಸ್ಯೆ ತೀವ್ರವಾಗಿದ್ದು ರಸ್ತೆಗಳಲ್ಲಿ ಹೊಂಡ ಬಿದ್ದಿವೆ.';
        } else if (language === 'hi') {
          originalText = params.text || 'हमारे इलाके में पीने के पानी की भारी किल्लत है और सड़कों पर गड्ढे भरे हैं।';
        } else {
          originalText = params.text || 'Water supply is irregular and the drainage near the main circle is blocked.';
        }
        citizenReq.transcript = originalText;
        citizenReq.originalText = originalText;
        this.save();
      }

      // Auto-detect language if hint was not provided
      if (/[\u0C80-\u0CFF]/.test(originalText)) {
        language = 'kn';
      } else if (/[\u0900-\u097F]/.test(originalText)) {
        language = 'hi';
      }

      // 2. Extracted Information
      const lower = originalText.toLowerCase();
      let category = 'Water Supply';
      let issue = 'Severe disruption in local civic utilities and infrastructure services.';
      let severity: SeverityLevel = 'high';

      if (lower.includes('road') || lower.includes('pothole') || lower.includes('ರಸ್ತೆ') || lower.includes('ಗದ್ದೆ') || lower.includes('सड़क') || lower.includes('गड्ढे')) {
        category = 'Roads & Transport';
        issue = 'Severe road damage, dangerous potholes, and inadequate transit access.';
        severity = 'high';
      } else if (lower.includes('drain') || lower.includes('garbage') || lower.includes('sewage') || lower.includes('ಕಸ') || lower.includes('ಚರಂಡಿ') || lower.includes('कचरा') || lower.includes('नाला')) {
        category = 'Sanitation & Waste';
        issue = 'Blocked stormwater drains and uncontrolled solid waste accumulation.';
        severity = 'high';
      } else if (lower.includes('doctor') || lower.includes('hospital') || lower.includes('clinic') || lower.includes('ಆಸ್ಪತ್ರೆ') || lower.includes('दवा')) {
        category = 'Healthcare';
        issue = 'Shortage of medical personnel and health services at local clinic.';
        severity = 'medium';
      } else if (lower.includes('light') || lower.includes('power') || lower.includes('ವಿದ್ಯುತ್') || lower.includes('बिजली')) {
        category = 'Electricity & Power';
        issue = 'Frequent power blackouts and non-operational streetlighting.';
        severity = 'medium';
      } else if (lower.includes('school') || lower.includes('ಶಾಲೆ') || lower.includes('स्कूल')) {
        category = 'Public Education';
        issue = 'Public school facility maintenance and sanitation deficiencies.';
        severity = 'low';
      }

      // 3. Location Resolution
      let resolvedAreaId = params.areaId;
      if (!resolvedAreaId && params.locationText) {
        const found = this.areas.find(a => 
          params.locationText?.toLowerCase().includes(a.name.toLowerCase()) ||
          a.name.toLowerCase().includes(params.locationText?.toLowerCase() || '')
        );
        if (found) resolvedAreaId = found.areaId;
      }

      // Default to Mahadevapura if completely unspecified
      if (!resolvedAreaId) {
        resolvedAreaId = 'area-mahadevapura';
      }

      const areaObj = this.areas.find(a => a.areaId === resolvedAreaId);
      const areaName = areaObj ? areaObj.name : 'Mahadevapura';

      // English Normalized Text
      let normalizedText = originalText;
      if (language === 'kn') {
        normalizedText = `[Translated from Kannada]: ${issue} Located at ${params.locationText || areaName}.`;
      } else if (language === 'hi') {
        normalizedText = `[Translated from Hindi]: ${issue} Located at ${params.locationText || areaName}.`;
      }

      // Create Processed Request
      const processed: ProcessedRequest = {
        id: internalId,
        requestId,
        language,
        originalText,
        normalizedText,
        translationApplied: language !== 'en',
        category,
        issue,
        severity,
        location: params.locationText || areaName,
        areaId: resolvedAreaId,
        areaName,
        geoResolution: 'area',
        themeId: `theme-${category.toLowerCase().replace(/\s+/g, '-')}`,
        processedAt: new Date().toISOString(),
        isTranscript: params.channel === 'voice'
      };

      this.processedRequests.unshift(processed);
      citizenReq.state = 'geolocated';
      this.save();
    }, 1800); // 1.8 seconds processing time
  }

  // --- API-003: Get Request Status ---
  public getRequestStatus(requestId: string): {
    request?: CitizenRequest;
    processed?: ProcessedRequest;
  } {
    const request = this.citizenRequests.find(r => r.id === requestId);
    const processed = this.processedRequests.find(p => p.requestId === requestId);
    return { request, processed };
  }

  // --- API-004: List Hotspots with Filters ---
  public getHotspots(filters: FilterState = {}): {
    hotspots: Hotspot[];
    totalRequests: number;
    matchingCount: number;
  } {
    // 1. Filter Processed Requests
    let filteredRequests = [...this.processedRequests];

    if (filters.category) {
      filteredRequests = filteredRequests.filter(r => r.category === filters.category);
    }
    if (filters.severity) {
      filteredRequests = filteredRequests.filter(r => r.severity === filters.severity);
    }
    if (filters.areaId) {
      filteredRequests = filteredRequests.filter(r => r.areaId === filters.areaId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      filteredRequests = filteredRequests.filter(r => 
        r.originalText.toLowerCase().includes(q) ||
        r.normalizedText.toLowerCase().includes(q) ||
        (r.areaName && r.areaName.toLowerCase().includes(q)) ||
        r.category.toLowerCase().includes(q)
      );
    }

    // 2. Group by Area to build Hotspots
    const areaMap = new Map<string, ProcessedRequest[]>();
    for (const req of filteredRequests) {
      if (!req.areaId) continue;
      const list = areaMap.get(req.areaId) || [];
      list.push(req);
      areaMap.set(req.areaId, list);
    }

    const hotspots: Hotspot[] = [];

    // Aggregate for each area that has requests
    for (const [areaId, reqs] of areaMap.entries()) {
      const area = this.areas.find(a => a.areaId === areaId);
      if (!area) continue;

      const requestCount = reqs.length;
      
      // Dominant category & breakdown
      const catCount: Record<string, number> = {};
      const sevDist: SeverityDistribution = { low: 0, medium: 0, high: 0 };

      for (const r of reqs) {
        catCount[r.category] = (catCount[r.category] || 0) + 1;
        if (r.severity === 'high') sevDist.high++;
        else if (r.severity === 'medium') sevDist.medium++;
        else sevDist.low++;
      }

      let dominantCategory = 'Water Supply';
      let maxCatCount = 0;
      const categoryBreakdown: CategoryShare[] = [];

      for (const [cat, cnt] of Object.entries(catCount)) {
        if (cnt > maxCatCount) {
          maxCatCount = cnt;
          dominantCategory = cat;
        }
        categoryBreakdown.push({
          category: cat,
          count: cnt,
          share: Number((cnt / requestCount).toFixed(2))
        });
      }

      // Sort categories descending
      categoryBreakdown.sort((a, b) => b.count - a.count);

      // Concentration Measure: requests per 100,000 residents
      const pop = area.population || 300000;
      const concentration = Number(((requestCount / (pop / 100000))).toFixed(1));

      const hotspotId = `hs-${areaId}`;
      const context = getContextForArea(areaId, pop);
      const interventions = getInterventionsForHotspot(
        hotspotId, 
        dominantCategory, 
        sevDist.high, 
        requestCount
      );

      // Evidence Breakdown (FR-012)
      const evidence = {
        signalsUsed: [
          {
            key: 'requestCount',
            label: 'Total Citizen Submissions in Area',
            value: requestCount,
            unit: 'verified reports',
            description: 'Direct citizen voice and text submissions associated with this administrative boundary.'
          },
          {
            key: 'dominantCategoryShare',
            label: `Dominant Category Share (${dominantCategory})`,
            value: `${Math.round((maxCatCount / requestCount) * 100)}%`,
            unit: 'share of volume',
            description: `${maxCatCount} out of ${requestCount} reports focused on ${dominantCategory}.`
          },
          {
            key: 'severityHigh',
            label: 'High Severity Submissions',
            value: sevDist.high,
            unit: 'critical reports',
            description: 'Submissions reporting immediate risk to public health, safety, or basic livelihood.'
          },
          {
            key: 'concentration',
            label: 'Geographic Concentration Density',
            value: concentration,
            unit: 'reports / 100k pop',
            description: 'Normalized volume relative to Census population baseline.'
          },
          {
            key: 'population',
            label: 'Baseline Area Population',
            value: pop.toLocaleString(),
            unit: 'residents',
            description: 'Denominator used for geographic concentration calculation.'
          }
        ],
        unavailableSignals: [
          {
            key: 'public_investment_alignment',
            label: 'Associated Public Investment (JJM / Smart City)',
            reason: 'TBD / requires verification — Jal Jeevan Mission API integration was proposed in project discussion but access is unverified. Must not be presented as a live government integration.'
          },
          {
            key: 'ward_contractor_sla',
            label: 'Municipal Contractor Work Order SLAs',
            reason: 'BBMP ward-level work order API is not accessible in this demonstration environment.'
          }
        ],
        method: {
          algorithm: 'Deterministic administrative area clustering and severity weighting',
          algorithmVersion: '1.0.0-mvp',
          timeWindow: 'Past 30 days (Seeded & Live)'
        }
      };

      hotspots.push({
        id: hotspotId,
        areaId,
        areaName: area.name,
        rank: 0, // Assigned after sorting
        requestCount,
        dominantCategory,
        categoryBreakdown,
        severityDistribution: sevDist,
        concentrationMeasure: concentration,
        timeWindow: 'Past 30 days',
        contributingRequestIds: reqs.map(r => r.id),
        context,
        evidence,
        interventions,
        generatedAt: new Date().toISOString(),
        algorithmVersion: '1.0.0-mvp',
        centroid: area.centroid
      });
    }

    // Sort by request count descending to determine rank
    hotspots.sort((a, b) => b.requestCount - a.requestCount);
    hotspots.forEach((h, idx) => {
      h.rank = idx + 1;
    });

    return {
      hotspots,
      totalRequests: this.processedRequests.length,
      matchingCount: filteredRequests.length
    };
  }

  // --- API-005 & API-006: Get Hotspot Detail & Contributing Requests ---
  public getHotspotDetail(hotspotId: string): {
    hotspot?: Hotspot;
    contributingRequests: ProcessedRequest[];
  } {
    const { hotspots } = this.getHotspots();
    const hotspot = hotspots.find(h => h.id === hotspotId);
    if (!hotspot) {
      return { hotspot: undefined, contributingRequests: [] };
    }

    const contributingRequests = this.processedRequests.filter(r => 
      hotspot.contributingRequestIds.includes(r.id)
    );

    return { hotspot, contributingRequests };
  }

  // Reset to initial seed state
  public resetToSeed() {
    localStorage.removeItem(CITIZEN_REQUESTS_KEY);
    localStorage.removeItem(PROCESSED_REQUESTS_KEY);
    this.init();
    this.notify();
  }
}

export const mockDataStore = new MockDataStore();
