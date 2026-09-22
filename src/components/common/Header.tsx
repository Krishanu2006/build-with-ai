import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Radio, BarChart3, FileText, RotateCcw } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useA11y } from '../../context/A11yContext';

export const Header: React.FC = () => {
  const { addToast } = useToast();
  const { announce } = useA11y();

  const handleResetData = () => {
    if (window.confirm('Reset all citizen submissions back to initial seeded demo dataset?')) {
      api.resetDemoData();
      addToast('Demo dataset has been reset to initial seed state', 'info');
      announce('Demo dataset reset to initial state');
      window.location.reload();
    }
  };

  return (
    <>
      {/* Skip links for keyboard accessibility (Design.md §11.2) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-primary focus:text-white focus:rounded focus:shadow-level-2 font-medium text-sm"
      >
        Skip to main content
      </a>
      <a
        href="#hotspot-list-section"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-48 focus:z-50 focus:px-4 focus:py-2 focus:bg-brand-secondary focus:text-white focus:rounded focus:shadow-level-2 font-medium text-sm"
      >
        Skip to hotspot list
      </a>

      <header className="h-[var(--header-height)] bg-white border-b border-brand-border sticky top-0 z-40 px-4 md:px-6 flex items-center justify-between shadow-sm">
        {/* Brand identity */}
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 text-brand-primary font-bold text-lg tracking-tight hover:opacity-90 focus-visible:rounded"
          >
            <div className="w-8 h-8 rounded bg-brand-primary text-white flex items-center justify-center font-bold text-base shadow-sm">
              CS
            </div>
            <div className="flex flex-col">
              <span className="leading-tight text-brand-primary font-bold text-base">CivicSignal</span>
              <span className="text-[10px] text-brand-text-muted font-normal tracking-normal -mt-0.5">
                Multilingual Civic Intelligence
              </span>
            </div>
          </Link>

          {/* Primary Nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  isActive
                    ? 'bg-brand-surface-alt text-brand-primary font-semibold border-b-2 border-brand-primary'
                    : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-surface-alt/60'
                }`
              }
            >
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/submit"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  isActive
                    ? 'bg-brand-surface-alt text-brand-primary font-semibold border-b-2 border-brand-primary'
                    : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-surface-alt/60'
                }`
              }
            >
              <Radio className="w-4 h-4" />
              <span>Submit Request</span>
            </NavLink>

            <NavLink
              to="/method"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                  isActive
                    ? 'bg-brand-surface-alt text-brand-primary font-semibold border-b-2 border-brand-primary'
                    : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-surface-alt/60'
                }`
              }
            >
              <FileText className="w-4 h-4" />
              <span>Method & Data</span>
            </NavLink>
          </nav>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3">
          {/* Mobile Nav Links */}
          <div className="flex md:hidden items-center gap-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `p-2 rounded text-xs font-medium ${isActive ? 'bg-brand-surface-alt text-brand-primary' : 'text-brand-text-muted'}`
              }
              title="Dashboard"
            >
              <BarChart3 className="w-4 h-4" />
            </NavLink>
            <NavLink
              to="/submit"
              className={({ isActive }) =>
                `p-2 rounded text-xs font-medium ${isActive ? 'bg-brand-surface-alt text-brand-primary' : 'text-brand-text-muted'}`
              }
              title="Submit Request"
            >
              <Radio className="w-4 h-4" />
            </NavLink>
            <NavLink
              to="/method"
              className={({ isActive }) =>
                `p-2 rounded text-xs font-medium ${isActive ? 'bg-brand-surface-alt text-brand-primary' : 'text-brand-text-muted'}`
              }
              title="Method"
            >
              <FileText className="w-4 h-4" />
            </NavLink>
          </div>

          <button
            onClick={handleResetData}
            title="Reset dataset to initial seed state"
            className="flex items-center gap-1.5 text-xs text-brand-text-muted hover:text-brand-text border border-brand-border px-2.5 py-1 rounded bg-brand-surface-alt/40 hover:bg-brand-surface-alt transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </header>
    </>
  );
};
