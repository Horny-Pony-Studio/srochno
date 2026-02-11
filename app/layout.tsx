import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import KonstaProvider from './konstaProvider';
import { TelegramProvider } from '@/providers/TelegramProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Срочно — услуги за 60 минут",
    template: "%s | Срочно",
  },
  description: "Telegram Mini App для срочных услуг. Создайте заказ — исполнитель найдётся за минуты.",
  openGraph: {
    title: "Срочно — услуги за 60 минут",
    description: "Создайте заказ — исполнитель найдётся за минуты.",
    type: "website",
    locale: "ru_RU",
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

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
    <html lang="ru">
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