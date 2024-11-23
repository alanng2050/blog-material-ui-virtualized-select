import { AppCacheProvider } from "@mui/material-nextjs/v13-pagesRouter";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps, ...rest }: AppProps) {
  return (
    <AppCacheProvider {...rest}>
      <Component {...pageProps} />
    </AppCacheProvider>
  );
}
