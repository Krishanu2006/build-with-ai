import React from 'react';
import { Link } from 'react-router-dom';
import { BareLayout } from '../layouts/BareLayout';
import { ProvenanceTag } from '../components/primitives/ProvenanceTag';
import { ShieldCheck, Database, Cpu, Eye, ArrowLeft } from 'lucide-react';

export const MethodPage: React.FC = () => {
  return (
    <BareLayout>
      <div className="space-y-8">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs text-brand-primary font-medium hover:underline mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Policymaker Dashboard</span>
          </Link>
          <h1 className="text-3xl font-bold text-brand-text tracking-tight">
            Methodology, System Governance & Data Provenance
          </h1>
          <p className="text-sm text-brand-text-muted mt-2 leading-relaxed">
            Institutional documentation explaining data origins, AI boundaries, aggregation rules, and algorithmic accountability standards.
          </p>
        </div>

        {/* 1. What CivicSignal Does and Does Not Do (DG-04, PRD 1.3) */}
        <section className="bg-white p-6 border border-brand-border rounded-xl shadow-level-1 space-y-4">
          <div className="flex items-center gap-2 text-brand-primary">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-lg font-bold text-brand-text">1. Advisory Decision-Support Principles</h2>
          </div>
          <div className="text-sm text-brand-text leading-relaxed space-y-3">
            <p>
              CivicSignal is an <strong>explainable civic intelligence and decision-support platform</strong> designed to assist public planners, district commissioners, and sector engineers.
            </p>
            <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs text-blue-950 space-y-1.5">
              <strong className="block font-semibold">Strict Guardrails:</strong>
              <ul className="list-disc list-inside space-y-1">
                <li>The platform <strong>never makes autonomous policy, budgetary, or work allocation decisions</strong>.</li>
                <li>Candidate interventions surfaced in the dashboard are explicitly advisory signals to accelerate review.</li>
                <li>Elected officials and administrative planners remain solely responsible for validating priorities and executing interventions.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2. Data Sources & Provenance Table (AC-014, AC-015) */}
        <section className="bg-white p-6 border border-brand-border rounded-xl shadow-level-1 space-y-4">
          <div className="flex items-center gap-2 text-brand-primary">
            <Database className="w-5 h-5" />
            <h2 className="text-lg font-bold text-brand-text">2. Data Sources & Verification Status</h2>
          </div>

          <p className="text-xs text-brand-text-muted leading-relaxed">
            In compliance with our transparency mandate, every dataset connected to the platform is declared with its provenance class and verification status. Missing or unverified sources are explicitly identified.
          </p>

          <div className="border border-brand-border rounded-lg overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-brand-surface-alt border-b border-brand-border text-brand-text font-semibold">
                  <th className="p-3">Data Domain</th>
                  <th className="p-3">Source & Vintage</th>
                  <th className="p-3">Provenance</th>
                  <th className="p-3">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border text-brand-text">
                <tr>
                  <td className="p-3 font-semibold">Citizen Development Feedback</td>
                  <td className="p-3 text-brand-text-muted">Synthetic demonstration corpus (English, ಕನ್ನಡ, हिन्दी)</td>
                  <td className="p-3"><ProvenanceTag provenance="synthetic" /></td>
                  <td className="p-3 text-emerald-800 font-medium">Verified for Demo</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Administrative Boundaries</td>
                  <td className="p-3 text-brand-text-muted">BBMP Ward & Taluk Polygon Geometry</td>
                  <td className="p-3"><ProvenanceTag provenance="public" /></td>
                  <td className="p-3 text-emerald-800 font-medium">Public Spatial Layer</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Population & Households</td>
                  <td className="p-3 text-brand-text-muted">Census 2011 (projected 2024 district handbook)</td>
                  <td className="p-3"><ProvenanceTag provenance="public" /></td>
                  <td className="p-3 text-emerald-800 font-medium">Public Demographic Baseline</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Water & Drainage Infrastructure</td>
                  <td className="p-3 text-brand-text-muted">OpenStreetMap Hydrography + State Water Audit</td>
                  <td className="p-3"><ProvenanceTag provenance="public" /></td>
                  <td className="p-3 text-emerald-800 font-medium">Public GIS & Audit Reports</td>
                </tr>
                <tr className="bg-amber-50/40">
                  <td className="p-3 font-semibold text-amber-900">Jal Jeevan Mission (JJM) Taps</td>
                  <td className="p-3 text-amber-800">National Rural Drinking Water Mission API</td>
                  <td className="p-3"><ProvenanceTag provenance="unavailable" /></td>
                  <td className="p-3 text-amber-900 font-bold">TBD / requires verification</td>
                </tr>
                <tr className="bg-amber-50/40">
                  <td className="p-3 font-semibold text-amber-900">Smart City Mobility Works</td>
                  <td className="p-3 text-amber-800">Ministry of Housing & Urban Affairs Work Orders</td>
                  <td className="p-3"><ProvenanceTag provenance="unavailable" /></td>
                  <td className="p-3 text-amber-900 font-bold">TBD / requires verification</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Where AI is Used vs Where Deterministic Logic is Used (TAD §10.1) */}
        <section className="bg-white p-6 border border-brand-border rounded-xl shadow-level-1 space-y-4">
          <div className="flex items-center gap-2 text-brand-primary">
            <Cpu className="w-5 h-5" />
            <h2 className="text-lg font-bold text-brand-text">3. Deterministic Aggregation vs. AI Boundaries</h2>
          </div>

          <p className="text-xs text-brand-text-muted leading-relaxed">
            To prevent "hallucinated priorities" or black-box policy drift, machine learning is strictly quarantined to language parsing tasks. Every figure, count, and ranking is computed deterministically.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-lg space-y-2">
              <span className="font-bold text-purple-900 uppercase tracking-wider block">
                Where AI is Applied (NLP Only)
              </span>
              <ul className="list-disc list-inside space-y-1 text-purple-950 leading-relaxed">
                <li>Speech-to-text audio transcription across languages.</li>
                <li>Language identification (Kannada, Hindi, English).</li>
                <li>Normalizing colloquial descriptions into structured civic categories (Water, Roads, Sanitation, Health).</li>
                <li>Severity heuristic tagging based on reported hazard indicators.</li>
              </ul>
            </div>

            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-lg space-y-2">
              <span className="font-bold text-emerald-900 uppercase tracking-wider block">
                Where Deterministic Logic is Enforced
              </span>
              <ul className="list-disc list-inside space-y-1 text-emerald-950 leading-relaxed">
                <li>Spatial aggregation by administrative boundaries.</li>
                <li>Direct counting of submissions and category shares.</li>
                <li>Concentration density calculation: <code>(reports / (population / 100k))</code>.</li>
                <li>Zero opaque composite priority scores — all rankings derive from transparent verifiable counts.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* 4. Accessibility Disclosure (NFR-005, DG-08) */}
        <section className="bg-white p-6 border border-brand-border rounded-xl shadow-level-1 space-y-4">
          <div className="flex items-center gap-2 text-brand-primary">
            <Eye className="w-5 h-5" />
            <h2 className="text-lg font-bold text-brand-text">4. Accessibility Equivalent Notice</h2>
          </div>

          <p className="text-xs text-brand-text-muted leading-relaxed">
            Interactive canvas maps present inherent accessibility limitations for screen reader and keyboard-only users. In accordance with WCAG 2.1 AA criteria, our <strong>Hotspot List View (`FC-010`)</strong> is designed as a co-equal, fully keyboard-operable equivalent conveying all spatial ranks, counts, and category shares.
          </p>
        </section>
      </div>
    </BareLayout>
  );
};
