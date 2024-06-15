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


// "use client";

// import React, { createContext, useState, useContext } from 'react';

// const UserContext = createContext();

// export function useUser() {
//   return useContext(UserContext);
// }

// export default function UserProvider({ children, value }) {
//   const [user, setUser] = useState(value || { id: null, firstname: '', lastname: '', email: '' });

//   return (
//     <UserContext.Provider value={{ user, setUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// }
