import React, { createContext, useContext, useState, useCallback } from 'react';

interface A11yContextType {
  announce: (message: string) => void;
}

const A11yContext = createContext<A11yContextType>({
  announce: () => {},
});

export const A11yProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [announcement, setAnnouncement] = useState('');

  const announce = useCallback((message: string) => {
    // Clear first to re-trigger assistive readers even on identical text
    setAnnouncement('');
    setTimeout(() => {
      setAnnouncement(message);
    }, 50);
  }, []);

  return (
    <A11yContext.Provider value={{ announce }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        id="civicsignal-a11y-announcer"
      >
        {announcement}
      </div>
    </A11yContext.Provider>
  );
};

export const useA11y = () => useContext(A11yContext);
