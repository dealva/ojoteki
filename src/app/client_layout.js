"use client";

import { SessionProvider } from "next-auth/react";

export default function ClientLayout({ children }) {
  return (
    <SessionProvider> {/* No need to pass session manually */}
      {children}
    </SessionProvider>
  );
}
