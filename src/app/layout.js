// "use client";
import "./globals.css";
import ThemeRegistry from "../components/ThemeRegistry";
import { Roboto, Roboto_Mono } from "next/font/google";
import { ToastProvider } from "@/context/shared/ToastContext";
import { AuthContextProvider } from "@/context/auth/AuthContext";
import SkipLink from "@/components/SkipLink";
import ClientLayout from "@/components/ClientLayout";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { VpnBannerProvider } from "@/context/shared/VpnBannerContext";
import PostHogProvider from "@/components/PostHogProvider";
import NextTopLoader from "nextjs-toploader";

export const metadata = {
  title: "EG Brandsync",
  description: "EG Brandsync — the single source of truth for design, brand guidelines, and digital assets across EG products.",
  robots: {
    index: false,
    follow: false,
  },
};

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  weight: ["500"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto-mono",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/api/tokens" />
</head>
      <body className={`${roboto.className} ${robotoMono.variable}`}>
        <NextTopLoader color="#0A7146" height={3} showSpinner={false} />
        <ThemeRegistry>
          <SkipLink />
          <ToastProvider>
            <AuthContextProvider>
              <VpnBannerProvider>
                <ClientLayout>
                  <AuthWrapper>
                    <PostHogProvider>{children}</PostHogProvider>
                  </AuthWrapper>
                  
                </ClientLayout>
              </VpnBannerProvider>
            </AuthContextProvider>
          </ToastProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
