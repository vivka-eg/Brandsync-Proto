// "use client";
import "./globals.css";
import ThemeRegistry from "../components/ThemeRegistry";
import { Roboto, Roboto_Mono } from "next/font/google";
import { ToastProvider } from "@/context/shared/ToastContext";
import { AuthContextProvider } from "@/context/auth/AuthContext";
import AuthWrapper from "@/components/auth/AuthWrapper";
import NextTopLoader from "nextjs-toploader";

// This is an auth-gated, MCP-driven client app — render dynamically rather than
// statically prerendering at build time (which fails without runtime context).
export const dynamic = "force-dynamic";

export const metadata = {
  title: "App",
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
          <ToastProvider>
            <AuthContextProvider>
              <AuthWrapper>
                {children}
              </AuthWrapper>
            </AuthContextProvider>
          </ToastProvider>
        </ThemeRegistry>
      </body>
    </html>
  );
}
