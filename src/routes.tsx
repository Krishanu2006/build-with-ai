import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CitizenRequestPage } from './pages/CitizenRequestPage';
import { SubmissionStatusPage } from './pages/SubmissionStatusPage';
import { DashboardPage } from './pages/DashboardPage';
import { MethodPage } from './pages/MethodPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/submit" element={<CitizenRequestPage />} />
      <Route path="/submit/:requestId" element={<SubmissionStatusPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/dashboard/hotspot/:hotspotId" element={<DashboardPage />} />
      <Route path="/method" element={<MethodPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
