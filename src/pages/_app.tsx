import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UIProvider } from "../components/ui/UIProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { SessionProvider } from "next-auth/react";

export default function App({ Component, pageProps }: AppProps) {

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID || ""}>
      <SessionProvider>
        <UIProvider>
          <Component {...pageProps} />
        </UIProvider>
      </SessionProvider>
    </GoogleOAuthProvider>
  );
}
