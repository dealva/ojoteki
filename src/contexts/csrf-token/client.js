'use client';

import { createContext, useContext } from 'react';

const CsrfTokenContext = createContext(null);

export function useCsrfToken() {
    const context = useContext(CsrfTokenContext);
    
    if (!context || !context.csrfToken) {
        throw new Error('useCsrfToken must be used within a ClientProvider with a valid csrfToken');
    }

    return context.csrfToken;
}

export default function ClientProvider({ csrfToken, children }) {
    if (!csrfToken) {
        throw new Error('CSRF token is required');
    }

    return (
        <CsrfTokenContext.Provider value={{ csrfToken }}>
            {children}
        </CsrfTokenContext.Provider>
    );
}
