'use client';
import { ReCaptchaProvider } from "next-recaptcha-v3";
export default function ClientProvider({ children }) {
    return (
        <ReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY} >
            {children}
        </ReCaptchaProvider>
    );
}