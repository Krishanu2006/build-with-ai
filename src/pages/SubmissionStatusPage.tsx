import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { RequestStatusCard } from '../components/request/RequestStatusCard';
import { EmptyState } from '../components/primitives/EmptyState';
import { Spinner } from '../components/primitives/Spinner';
import { api } from '../services/api';
import { CitizenRequest, ProcessedRequest } from '../types/domain';
import { useA11y } from '../context/A11yContext';

export const SubmissionStatusPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const { announce } = useA11y();

  const [request, setRequest] = useState<CitizenRequest | null>(null);
  const [processed, setProcessed] = useState<ProcessedRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!requestId) return;

    let pollCount = 0;
    const maxPolls = 20;

    const checkStatus = async () => {
      try {
        const res = await api.getRequestStatus(requestId);
        if (res.request) {
          setRequest(res.request);
          if (res.processed) {
            setProcessed(res.processed);
            announce(`Request ${requestId} structured: categorized as ${res.processed.category}, severity ${res.processed.severity}.`);
          }
        }
      } catch (err) {
        console.error('Error fetching request status', err);
      } finally {
        setLoading(false);
      }
    };

    checkStatus();

    // Polling interval while still processing
    const interval = setInterval(async () => {
      pollCount++;
      if (pollCount > maxPolls) {
        clearInterval(interval);
        return;
      }

      const res = await api.getRequestStatus(requestId);
      if (res.request) {
        setRequest(res.request);
        if (res.processed) {
          setProcessed(res.processed);
          clearInterval(interval);
        }
      }
    }, 800);

    return () => clearInterval(interval);
  }, [requestId, announce]);

  if (loading) {
    return (
      <PublicLayout>
        <div className="p-12 text-center space-y-4">
          <Spinner size="lg" className="mx-auto text-brand-primary" />
          <p className="text-sm font-semibold text-brand-text">
            Looking up submission status...
          </p>
        </div>
      </PublicLayout>
    );
  }

  if (!request) {
    return (
      <PublicLayout>
        <EmptyState
          title="Submission Not Found"
          description={`We could not locate any citizen request with identifier "${requestId}". Please check the ID or submit a new report.`}
          actionLabel="Submit a New Request"
          onAction={() => window.location.href = '/submit'}
        />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-brand-primary tracking-tight">
            Submission Confirmation & Receipt
          </h1>
          <p className="text-xs text-brand-text-muted">
            Track how your feedback is processed and integrated into municipal evidence.
          </p>
        </div>

        <RequestStatusCard request={request} processed={processed || undefined} />
      </div>
    </PublicLayout>
  );
};
