import { CandidateIntervention } from '../../types/domain';

export function getInterventionsForHotspot(
  hotspotId: string,
  dominantCategory: string,
  highSeverityCount: number,
  requestCount: number
): CandidateIntervention[] {
  const list: CandidateIntervention[] = [];

  if (dominantCategory === 'Water Supply') {
    list.push({
      id: `int-${hotspotId}-1`,
      hotspotId,
      title: 'Emergency Tanker Tariff Cap & BWSSB Buffer Depots',
      rationale: `Direct response to high volume (${requestCount} reports) of acute drinking water shortages. Establish regulated municipal distribution kiosks to counteract private tanker rate exploitation while feeder pipeline works progress.`,
      linkedSignals: ['requestCount', 'dominantCategory', 'piped_water'],
      generationSource: 'curated'
    });
    list.push({
      id: `int-${hotspotId}-2`,
      hotspotId,
      title: 'Accelerated Feeder Line Linkage to Master Balancing Reservoir',
      rationale: `Addresses persistent reports of laid pipelines remaining dry. Expedite trunk connection inspection to commission municipal piped supply into unserved extensions.`,
      linkedSignals: ['dominantCategory', 'severityHigh'],
      generationSource: 'curated'
    });
  } else if (dominantCategory === 'Roads & Transport') {
    list.push({
      id: `int-${hotspotId}-1`,
      hotspotId,
      title: 'Rapid Response Cold-Mix Pothole Restoration on Arterial Links',
      rationale: `Responds to ${highSeverityCount} high-severity two-wheeler accident hazard reports. Mobilize rapid mechanical patch resurfacing teams within 48 hours for arterial corridors.`,
      linkedSignals: ['severityHigh', 'dominantCategory'],
      generationSource: 'curated'
    });
    list.push({
      id: `int-${hotspotId}-2`,
      hotspotId,
      title: 'Sidewalk Clearing & Pedestrian Crossing Signalization',
      rationale: `Triggered by pedestrian encroachment complaints. Reclaim pedestrian sidewalks near transit hubs and synchronize mid-block signal timing.`,
      linkedSignals: ['requestCount', 'concentration'],
      generationSource: 'curated'
    });
  } else if (dominantCategory === 'Sanitation & Waste') {
    list.push({
      id: `int-${hotspotId}-1`,
      hotspotId,
      title: 'Urgent Mechanized Stormwater Drain Desilting (Rajakaluve)',
      rationale: `Formulated from repeated domestic flood and dengue risk alerts. Deploy mechanical excavators to eliminate choke points in secondary storm drains prior to heavy rainfall.`,
      linkedSignals: ['requestCount', 'osm_drainage', 'severityHigh'],
      generationSource: 'curated'
    });
    list.push({
      id: `int-${hotspotId}-2`,
      hotspotId,
      title: 'Intensive Solid Waste Blackspot Elimination & Night Patrolling',
      rationale: `Mitigates open dumping and roadside waste burning hazards identified in citizen submissions. Institute dedicated micro-collection routes and surveillance.`,
      linkedSignals: ['dominantCategory', 'requestCount'],
      generationSource: 'curated'
    });
  } else if (dominantCategory === 'Healthcare') {
    list.push({
      id: `int-${hotspotId}-1`,
      hotspotId,
      title: 'Evening Clinic Staffing & Essential Drug Replenishment at PHC',
      rationale: `Directly targets community complaints regarding evening doctor unavailability and medicine stockouts. Authorize emergency district health fund allocations for temporary medical officer rosters.`,
      linkedSignals: ['phc_ratio', 'severityHigh'],
      generationSource: 'curated'
    });
  } else if (dominantCategory === 'Electricity & Power') {
    list.push({
      id: `int-${hotspotId}-1`,
      hotspotId,
      title: 'Distribution Transformer Load Audit & Underground Cable Retrofit',
      rationale: `Addresses repeated voltage surge damage and prolonged blackout complaints. Implement transformer relief installations and trim overgrown branches along overhead 11kV lines.`,
      linkedSignals: ['severityHigh', 'requestCount'],
      generationSource: 'curated'
    });
  } else {
    // Public Education or General
    list.push({
      id: `int-${hotspotId}-1`,
      hotspotId,
      title: 'School Sanitation & Continuous Running Water Provision',
      rationale: `Identified from citizen concerns regarding public school washrooms. Connect school facilities directly to emergency municipal water network to maintain attendance.`,
      linkedSignals: ['dominantCategory', 'severityHigh'],
      generationSource: 'curated'
    });
  }

  // Add an AI-assisted suggestion reflecting multi-sector context
  list.push({
    id: `int-${hotspotId}-ai`,
    hotspotId,
    title: 'Integrated Inter-Agency Task Force Coordination',
    rationale: `Cross-analysis of demand patterns indicates compounded infrastructure vulnerability. Convene joint review with civic ward committees to synchronize road, water, and drainage works.`,
    linkedSignals: ['requestCount', 'concentration'],
    generationSource: 'ai'
  });

  return list;
}
