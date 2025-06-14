// context/csrf-token/server.js
'use server';

import ClientProvider from './client';
import { headers } from 'next/headers';

export default async function ServerProvider({ children }) {
    const h = await headers();
    const csrfToken = h.get('X-CSRF-Token') || 'missing';
    console.log('CSRF Token server:', csrfToken); // Log the CSRF token
    return (
        <ClientProvider csrfToken={csrfToken}>
            {children}
        </ClientProvider>
    );
}
