import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TRPCReactProvider } from "@/trpc/client";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Woody AI",
  description: "Woody AI is a powerful AI assistant that helps you with your daily tasks. create, manage, and automate your workflows with ease.",
};

/**
 * Root layout component that sets up global providers, theming, fonts, and notification support for the application.
 *
 * Wraps the app with tRPC context, applies custom fonts, manages theme switching, and includes a toast notification system.
 *
 * @param children - The content to render within the layout
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TRPCReactProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning>
          <ThemeProvider
            attribute={'class'}
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange={true}
          >
            <Toaster />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </TRPCReactProvider>
  );
}
