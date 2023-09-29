import React, { createContext, useState } from 'react';

const SpinnerContext = createContext();

function SpinnerProvider({ children }) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  return (
    <SpinnerContext.Provider value={{ isSubmitting, setIsSubmitting }}>
      {children}
    </SpinnerContext.Provider>
  );
}

export { SpinnerProvider, SpinnerContext };
