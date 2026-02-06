import { Geist, Geist_Mono } from "next/font/google";
import KonstaProvider from './konstaProvider';
import { TelegramProvider } from '../src/providers/TelegramProvider';
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
      <head>
        <script src="https://telegram.org/js/telegram-web-app.js" async></script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <TelegramProvider>
          <KonstaProvider>{children}</KonstaProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}