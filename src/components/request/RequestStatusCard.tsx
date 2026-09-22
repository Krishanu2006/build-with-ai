import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Copy, Check, MapPin, Tag, AlertTriangle, ArrowRight, Mic } from 'lucide-react';
import { CitizenRequest, ProcessedRequest } from '../../types/domain';
import { Badge } from '../primitives/Badge';
import { Button } from '../primitives/Button';
import { Spinner } from '../primitives/Spinner';
import { SkeletonBlock } from '../primitives/SkeletonBlock';
import { useToast } from '../../context/ToastContext';

export interface RequestStatusCardProps {
  request: CitizenRequest;
  processed?: ProcessedRequest;
}

export const RequestStatusCard: React.FC<RequestStatusCardProps> = ({
  request,
  processed,
}) => {
  const { addToast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(request.id);
    setCopied(true);
    addToast('Request ID copied to clipboard', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const isProcessing = request.state === 'received' || request.state === 'transcribed' || request.state === 'normalized';
  const isFailed = request.state === 'failed' || request.state === 'extraction_failed' || request.state === 'transcription_failed';

  return (
    <div className="space-y-6">
      {/* 1. Header confirmation banner */}
      <div className="bg-white border border-brand-border rounded-xl p-6 shadow-level-1 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-border pb-4">
          <div>
            <span className="text-xs uppercase font-semibold text-brand-text-muted tracking-wider">
              Request Tracking Identifier
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-mono text-xl font-bold text-brand-primary">
                {request.id}
              </span>
              <button
                onClick={handleCopyId}
                className="p-1.5 text-brand-text-muted hover:text-brand-text border border-brand-border rounded bg-brand-surface-alt hover:bg-gray-200 transition-colors"
                title="Copy Request ID"
                aria-label="Copy Request ID"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isProcessing ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
                <Spinner size="xs" className="text-amber-700" />
                <span>AI Processing In Progress</span>
              </span>
            ) : isFailed ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                <span>Recorded — Manual Review Needed</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-900 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Processed & Aggregated</span>
              </span>
            )}
          </div>
        </div>

        {/* Processing stage notification */}
        {isProcessing && (
          <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-lg flex items-start gap-3">
            <Spinner size="sm" className="text-brand-primary mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-brand-primary">Analyzing your civic submission...</p>
              <p className="text-xs text-brand-text-muted mt-0.5">
                Our pipeline is transcribing speech, detecting language, extracting key civic categories, and matching geographic coordinates.
              </p>
            </div>
          </div>
        )}

        {isFailed && (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-semibold text-amber-900">Request received safely</p>
              <p className="text-xs text-amber-800 mt-0.5">
                Automated structuring encountered an issue. Your original input is safely preserved in our database and will be reviewed manually by municipal staff.
              </p>
            </div>
          </div>
        )}

        {/* Original Citizen Submission Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-brand-text-muted">
            <span className="font-semibold uppercase tracking-wider">Your Submission</span>
            <div className="flex items-center gap-2">
              {request.channel === 'voice' && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                  <Mic className="w-3 h-3" /> Voice Recording
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
          <div className="p-3.5 bg-brand-surface-alt rounded-lg text-sm text-brand-text leading-relaxed border border-brand-border">
            {request.originalText || '[Audio recording recorded and transmitted]'}
          </div>
        </div>
      </div>

      {/* 2. "What we understood" Structured Interpretation Card (FC-007 / DC-09) */}
      <div className="bg-white border border-brand-border rounded-xl p-6 shadow-level-1 space-y-4">
        <div className="flex items-center justify-between border-b border-brand-border pb-3">
          <div>
            <h3 className="text-base font-semibold text-brand-text">
              What We Understood (Structured Civic Evidence)
            </h3>
            <p className="text-xs text-brand-text-muted">
              Machine-extracted fields used to group and count your issue in planning hotspots.
            </p>
          </div>
        </div>

        {isProcessing && (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SkeletonBlock className="h-14" />
              <SkeletonBlock className="h-14" />
            </div>
            <SkeletonBlock className="h-20" />
            <SkeletonBlock className="h-10" />
          </div>
        )}

        {!isProcessing && processed && (
          <div className="space-y-4">
            {/* Category and Severity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="p-3 bg-brand-surface-alt/70 border border-brand-border rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-brand-text-muted">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Civic Sector Category</span>
                </div>
                <div className="pt-0.5">
                  <Badge variant="category">{processed.category}</Badge>
                </div>
              </div>

              <div className="p-3 bg-brand-surface-alt/70 border border-brand-border rounded-lg space-y-1">
                <div className="text-xs text-brand-text-muted">Assessed Severity</div>
                <div className="pt-0.5">
                  <Badge variant="severity" severity={processed.severity} />
                </div>
              </div>
            </div>

            {/* Structured Issue Description */}
            <div className="p-3.5 bg-brand-surface-alt/70 border border-brand-border rounded-lg space-y-1">
              <div className="text-xs text-brand-text-muted font-medium">Issue Summary</div>
              <p className="text-sm font-medium text-brand-text">
                {processed.issue}
              </p>
            </div>

            {/* Resolved Location & Language */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-sm">
              <div className="p-3 bg-brand-surface-alt/70 border border-brand-border rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-brand-text-muted">
                  <MapPin className="w-3.5 h-3.5 text-brand-primary" />
                  <span>Resolved Administrative Area</span>
                </div>
                <p className="font-semibold text-brand-primary">
                  {processed.areaName || 'Mahadevapura'}
                </p>
                <p className="text-xs text-brand-text-muted">
                  Location details: {processed.location}
                </p>
              </div>

              <div className="p-3 bg-brand-surface-alt/70 border border-brand-border rounded-lg space-y-1">
                <div className="text-xs text-brand-text-muted">Detected Language & Translation</div>
                <div className="flex items-center gap-2 pt-0.5">
                  <Badge variant="language">{processed.language}</Badge>
                  <span className="text-xs text-brand-text-muted">
                    {processed.translationApplied ? 'Normalized to English for planner comparison' : 'Original text preserved'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Next Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <Link to="/submit" className="w-full sm:w-auto">
          <Button variant="outline" className="w-full sm:w-auto">
            Submit Another Request
          </Button>
        </Link>

        <Link to="/dashboard" className="w-full sm:w-auto">
          <Button
            variant="primary"
            icon={<ArrowRight className="w-4 h-4" />}
            className="w-full sm:w-auto"
          >
            Explore Policymaker Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
