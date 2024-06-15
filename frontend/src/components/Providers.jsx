'use client';

import React, { createContext } from 'react';

export const UserContext = createContext();

export default function Providers({ children, session }) {
  return (
    <UserContext.Provider value={{ session }}>
      {children}
    </UserContext.Provider>
  );
};


