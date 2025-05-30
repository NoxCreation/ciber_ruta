import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UIProvider } from "../components/ui/UIProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/Providers/AuthProvider";
import { AuthGuard } from "@/Providers/AuthGuard";

export default function App({ Component, pageProps }: AppProps) {
  
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_CLIENT_ID || ""}>
      <AuthProvider>
        <AuthGuard>
          <UIProvider>
            <Component {...pageProps} />
          </UIProvider>
        </AuthGuard>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
