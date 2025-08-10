import "@/styles/globals.css";
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { AuthProvider } from "@/context/AuthContext";

import React, { useState, useEffect } from "react";
import { AppProps } from "next/app";
import {
  QueryClient,
  QueryClientProvider,
  QueryClientConfig,
} from "@tanstack/react-query";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useRouter } from "next/router";
import theme from "@/ui/theme";
import { Layout } from "@/components";
import PageLoader from "@/components/PageLoader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type CustomAppProps = AppProps & {
  Component: AppProps['Component'] & {
    noLayout?: boolean;
  }
};

const config: QueryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
};

export default function MyApp({ Component, pageProps }: CustomAppProps) {
  const [queryClient] = useState(() => new QueryClient(config));
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleStart = () => {
      timeout = setTimeout(() => setShowLoader(true), 100);
    };
    
    const handleStop = () => {
      clearTimeout(timeout);
      setShowLoader(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  const getLayout = Component.noLayout 
    ? (page: React.ReactNode) => page
    : (page: React.ReactNode) => <Layout>{page}</Layout>;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <CssBaseline />
          {showLoader && <PageLoader />}
          {getLayout(<Component {...pageProps} />)}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}