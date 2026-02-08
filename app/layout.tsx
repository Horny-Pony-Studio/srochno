import { Geist, Geist_Mono } from "next/font/google";
import KonstaProvider from './konstaProvider';
import { TelegramProvider } from '@/providers/TelegramProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
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
    <html lang="uk">
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TelegramProvider>
          <AuthProvider>
            <QueryProvider>
              <ThemeProvider>
                <KonstaProvider>{children}</KonstaProvider>
              </ThemeProvider>
            </QueryProvider>
          </AuthProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}