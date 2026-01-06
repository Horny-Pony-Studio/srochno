import { Geist, Geist_Mono } from "next/font/google";
import KonstaProvider from './konstaProvider';
import AppStateProvider from "@/src/state/appState";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <KonstaProvider>
          <AppStateProvider>{children}</AppStateProvider>
        </KonstaProvider>
      </body>
    </html>
  );
}