import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UIProvider } from "../components/ui/UIProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SessionProvider } from "next-auth/react";
import { ChangeDetected } from "@/provider/ChangeDetected";

export default function App({ Component, pageProps }: AppProps) {

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID || ""}>
      <SessionProvider>
        <ChangeDetected>
          <UIProvider>
            <Component {...pageProps} />
          </UIProvider>
        </ChangeDetected>
      </SessionProvider>
    </GoogleOAuthProvider>
  );
}
