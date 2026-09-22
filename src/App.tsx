import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { A11yProvider } from './context/A11yContext';
import { ToastProvider } from './context/ToastContext';
import { AppRoutes } from './routes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <A11yProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </A11yProvider>
    </BrowserRouter>
  );
};

export default App;
