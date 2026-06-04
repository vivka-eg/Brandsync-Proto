// "use client";
import "./globals.css";
import ThemeRegistry from "../components/ThemeRegistry";
import { Roboto, Roboto_Mono } from "next/font/google";
import { ToastProvider } from "@/context/shared/ToastContext";
import { AuthContextProvider } from "@/context/auth/AuthContext";
import SkipLink from "@/components/SkipLink";
import AuthWrapper from "@/components/auth/AuthWrapper";
import PostHogProvider from "@/components/PostHogProvider";
import NextTopLoader from "nextjs-toploader";

export const metadata = {
  title: "BrandSync Make",
  description: "BrandSync Make — generate on-brand UI from the BrandSync design system, powered by the BrandSync MCP.",
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
              <AuthWrapper>
                <PostHogProvider>{children}</PostHogProvider>
              </AuthWrapper>
            </AuthContextProvider>
          </ToastProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
