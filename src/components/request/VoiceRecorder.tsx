import React, { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, RotateCcw, AlertCircle, Type } from 'lucide-react';
import { Button } from '../primitives/Button';
import { useA11y } from '../../context/A11yContext';

export interface VoiceRecorderProps {
  onAudioRecorded: (blob: Blob, durationMs: number) => void;
  onClearAudio: () => void;
  onFallbackToText: () => void;
  disabled?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onAudioRecorded,
  onClearAudio,
  onFallbackToText,
  disabled = false,
}) => {
  const { announce } = useA11y();
  const [recorderState, setRecorderState] = useState<'idle' | 'recording' | 'recorded' | 'denied'>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, [audioUrl]);

  const startRecording = async () => {
    try {
      setPermissionError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setRecorderState('recorded');
        onAudioRecorded(audioBlob, elapsedSeconds * 1000);
        announce(`Voice recording finished. Duration: ${elapsedSeconds} seconds. Ready for review or submission.`);
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(250);
      setRecorderState('recording');
      setElapsedSeconds(0);
      announce('Recording started. Please speak your civic request.');

      timerRef.current = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } catch (err: unknown) {
      console.warn('Microphone permission issue:', err);
      const isDenied = err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError');
      setRecorderState('denied');
      setPermissionError(
        isDenied
          ? 'Microphone permission was not granted by your browser. You can type your request directly instead.'
          : 'Could not access audio recording hardware. Please use text input instead.'
      );
      announce('Microphone permission denied. Switched to text input mode option.');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const reRecord = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setRecorderState('idle');
    setElapsedSeconds(0);
    setIsPlaying(false);
    onClearAudio();
    announce('Voice recording cleared. You can start a new recording.');
  };

  const togglePlayback = () => {
    if (!audioElementRef.current && audioUrl) {
      audioElementRef.current = new Audio(audioUrl);
      audioElementRef.current.onended = () => setIsPlaying(false);
    }

    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
        setIsPlaying(false);
      } else {
        audioElementRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  // Permission denied state (AC-004 fallback)
  if (recorderState === 'denied') {
    return (
      <div className="p-6 bg-brand-surface-alt border border-brand-border rounded-xl text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 text-brand-warning flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-base font-semibold text-brand-text mb-1">
            Microphone Not Available
          </h4>
          <p className="text-sm text-brand-text-muted max-w-md mx-auto">
            {permissionError}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={onFallbackToText}
          icon={<Type className="w-4 h-4" />}
        >
          Switch to Text Input
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white border border-brand-border rounded-xl text-center shadow-level-1 space-y-4">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-brand-text">
          Speak your request in English, ಕನ್ನಡ, or हिन्दी
        </h3>
        <p className="text-xs text-brand-text-muted">
          Our automated civic intelligence engine will transcribe and process your voice.
        </p>
      </div>

      {/* Recording in progress */}
      {recorderState === 'recording' && (
        <div className="space-y-4 py-4 animate-in fade-in">
          <div className="flex items-center justify-center gap-3">
            <span className="relative flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
            </span>
            <span className="text-xl font-mono font-bold text-red-700 tabular-nums">
              {formatTime(elapsedSeconds)}
            </span>
          </div>

          <p className="text-xs text-brand-text-muted italic">
            Speaking... Press stop when finished.
          </p>

          <Button
            variant="danger"
            size="lg"
            onClick={stopRecording}
            icon={<Square className="w-4 h-4 fill-white" />}
            className="w-full max-w-xs mx-auto"
          >
            Stop Recording
          </Button>
        </div>
      )}

      {/* Recorded successfully */}
      {recorderState === 'recorded' && (
        <div className="space-y-4 py-2">
          <div className="flex items-center justify-center gap-2 text-sm text-emerald-800 font-medium bg-emerald-50 py-2 px-4 rounded-full max-w-xs mx-auto border border-emerald-200">
            <span>Voice recorded ({formatTime(elapsedSeconds)})</span>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayback}
              icon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            >
              {isPlaying ? 'Pause Audio' : 'Preview Recording'}
            </Button>

            <Button
              variant="subtle"
              size="sm"
              onClick={reRecord}
              icon={<RotateCcw className="w-4 h-4" />}
            >
              Re-record
            </Button>
          </div>
        </div>
      )}

      {/* Idle state */}
      {recorderState === 'idle' && (
        <div className="py-4">
          <button
            type="button"
            disabled={disabled}
            onClick={startRecording}
            aria-label="Start audio recording"
            className="w-20 h-20 rounded-full bg-brand-primary text-white hover:bg-brand-primary-hover shadow-level-2 flex flex-col items-center justify-center mx-auto transition-transform active:scale-95 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-focus"
          >
            <Mic className="w-8 h-8" />
          </button>
          <p className="text-xs text-brand-text-muted mt-3 font-medium">
            Click microphone to start speaking
          </p>
        </div>
      )}
    </div>
  );
};
