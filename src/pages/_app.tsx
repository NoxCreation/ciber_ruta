import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UIProvider } from "../components/ui/UIProvider";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UIProvider>
      <Component {...pageProps} />
    </UIProvider>
  )
}
