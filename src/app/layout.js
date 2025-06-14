import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

import ClientProvider from "@/contexts/recaptcha/client";
import { ToastContainer } from "react-toastify";
import ClientLayout from "./client_layout";
import WebsocketContext from "@/contexts/websocket/client"
// Global layout with WebSocket, Navbar, Footer, etc.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "OJOTEKI",
  description: "OJOTEKI - Your Online Javanese Grocery Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
       <head>
        {/* Load Snap SDK with Client Key */}
        <script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          async
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WebsocketContext>
          <ClientLayout>
            <ClientProvider>
                {children}
            </ClientProvider>
          </ClientLayout>
        </WebsocketContext>
        
        
        <div className="bg-[#F5F1E9] text-[#6B4C3B] text-xs text-center p-2 rounded">
          This site is protected by reCAPTCHA and the Google&nbsp;
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#50382d]"
          >
            Privacy Policy
          </a> and&nbsp;
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#50382d]"
          >
            Terms of Service
          </a> apply.
        </div>
        <ToastContainer position="top-center" />

      </body>
    </html>
  );
}
