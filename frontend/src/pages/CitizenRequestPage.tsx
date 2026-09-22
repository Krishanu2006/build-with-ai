import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronUp, Send } from 'lucide-react';
import { PublicLayout } from '../layouts/PublicLayout';
import { ModeToggle } from '../components/request/ModeToggle';
import { TextRequestInput } from '../components/request/TextRequestInput';
import { VoiceRecorder } from '../components/request/VoiceRecorder';
import { LanguageSelector } from '../components/request/LanguageSelector';
import { LocationInput } from '../components/request/LocationInput';
import { Button } from '../components/primitives/Button';
import { ErrorState } from '../components/primitives/ErrorState';
import { api } from '../services/api';
import { ReferenceTaxonomy, GeographicArea, RequestChannel } from '../types/domain';
import { useA11y } from '../context/A11yContext';
import { useToast } from '../context/ToastContext';

export const CitizenRequestPage: React.FC = () => {
  const navigate = useNavigate();
  const { announce } = useA11y();
  const { addToast } = useToast();

  const [mode, setMode] = useState<RequestChannel>('text');
  const [text, setText] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [languageHint, setLanguageHint] = useState('');
  const [locationText, setLocationText] = useState('');
  const [areaId, setAreaId] = useState('');
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [taxonomy, setTaxonomy] = useState<ReferenceTaxonomy | null>(null);
  const [areas, setAreas] = useState<GeographicArea[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    Promise.all([api.getTaxonomy(), api.getAreas()])
      .then(([tax, ar]) => {
        setTaxonomy(tax);
        setAreas(ar);
      })
      .catch(err => {
        console.warn('Could not load metadata, continuing with defaults', err);
      });
  }, []);

  const handleAudioRecorded = (blob: Blob) => {
    setAudioBlob(blob);
    setFieldErrors(prev => ({ ...prev, audio: '' }));
  };

  const handleClearAudio = () => {
    setAudioBlob(null);
  };

  const handleFallbackToText = () => {
    setMode('text');
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    const errors: Record<string, string> = {};

    if (mode === 'text') {
      if (!text.trim()) {
        errors.text = 'Please describe the civic issue before submitting.';
      } else if (text.trim().length < 5) {
        errors.text = 'Please provide a little more detail about the problem.';
      }
    } else {
      if (!audioBlob) {
        errors.audio = 'Please record your voice request before submitting.';
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      announce('Form has errors. Please check the required fields.');
      return;
    }

    setIsSubmitting(true);
    announce('Submitting your civic request...');

    try {
      let res;
      if (mode === 'text') {
        res = await api.submitText({
          text: text.trim(),
          languageHint: languageHint || undefined,
          locationText: locationText.trim() || undefined,
          areaId: areaId || undefined,
        });
      } else {
        res = await api.submitVoice({
          audioBlob: audioBlob!,
          languageHint: languageHint || undefined,
          locationText: locationText.trim() || undefined,
          areaId: areaId || undefined,
        });
      }

      addToast('Your request was received successfully!', 'success');
      announce(`Request submitted successfully. Assigned tracking ID ${res.requestId}.`);
      navigate(`/submit/${res.requestId}`);
    } catch (err) {
      console.error('Submission failed', err);
      setSubmitError('Unable to transmit request. Your text and audio have been kept intact in this form. Please retry.');
      setIsSubmitting(false);
    }
  };

  const isSubmitDisabled = mode === 'text' ? !text.trim() : !audioBlob;
  const disabledReason = isSubmitDisabled
    ? mode === 'text'
      ? 'Please describe the problem above before submitting'
      : 'Please record audio before submitting'
    : undefined;

  return (
    <PublicLayout>
      <div className="space-y-6">
        {/* Page title and introductory framing (Design.md §2.1 & §6) */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-primary tracking-tight">
            Report a Civic or Infrastructure Need
          </h1>
          <p className="text-sm text-brand-text-muted max-w-lg mx-auto leading-relaxed">
            Communicate in your own language using voice or free text. Your report is automatically categorized and aggregated into public planning evidence for municipal officials.
          </p>
        </div>

        {/* Input Mode Selector (DC-01) */}
        <ModeToggle
          mode={mode}
          onChange={setMode}
          disabled={isSubmitting}
        />

        {/* Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {submitError && (
            <ErrorState
              title="Transmission Problem"
              message={submitError}
              dataPreservedNotice="Your description and audio are preserved. You can click retry immediately."
              onRetry={handleSubmit as any}
            />
          )}

          {/* Text vs Voice Active Input */}
          {mode === 'text' ? (
            <TextRequestInput
              value={text}
              onChange={val => {
                setText(val);
                if (fieldErrors.text) setFieldErrors(prev => ({ ...prev, text: '' }));
              }}
              error={fieldErrors.text}
              disabled={isSubmitting}
            />
          ) : (
            <div className="space-y-2">
              <VoiceRecorder
                onAudioRecorded={handleAudioRecorded}
                onClearAudio={handleClearAudio}
                onFallbackToText={handleFallbackToText}
                disabled={isSubmitting}
              />
              {fieldErrors.audio && (
                <p className="text-xs text-brand-error font-medium text-center" role="alert">
                  {fieldErrors.audio}
                </p>
              )}
            </div>
          )}

          {/* Optional Details Disclosure (DC-04) */}
          <div className="border border-brand-border rounded-lg bg-white overflow-hidden shadow-sm">
            <button
              type="button"
              onClick={() => setIsDetailsOpen(prev => !prev)}
              aria-expanded={isDetailsOpen}
              className="w-full p-3.5 bg-brand-surface-alt/60 hover:bg-brand-surface-alt flex items-center justify-between text-left text-xs font-semibold text-brand-text transition-colors"
            >
              <span>Add Location or Language Preference (Optional)</span>
              {isDetailsOpen ? <ChevronUp className="w-4 h-4 text-brand-text-muted" /> : <ChevronDown className="w-4 h-4 text-brand-text-muted" />}
            </button>

            {isDetailsOpen && (
              <div className="p-4 space-y-4 border-t border-brand-border">
                {taxonomy && (
                  <LanguageSelector
                    languages={taxonomy.languages}
                    selectedCode={languageHint}
                    onChange={setLanguageHint}
                    disabled={isSubmitting}
                  />
                )}

                <LocationInput
                  locationText={locationText}
                  onLocationTextChange={setLocationText}
                  areaId={areaId}
                  onAreaIdChange={setAreaId}
                  areas={areas}
                  disabled={isSubmitting}
                />
              </div>
            )}
          </div>

          {/* Submit Action (FC-006 / DC-07) */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              busy={isSubmitting}
              busyText="Submitting your request..."
              disabled={isSubmitDisabled}
              disabledReason={disabledReason}
              icon={<Send className="w-4 h-4" />}
              className="w-full shadow-level-2"
            >
              Submit Civic Request
            </Button>
            <p className="text-center text-[11px] text-brand-text-muted mt-2">
              No login required. We protect your privacy and collect no personal identifiers.
            </p>
          </div>
        </form>
      </div>
    </PublicLayout>
  );
};
