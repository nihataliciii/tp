import type { Metadata } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/AppContext';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'TimePerception — Zaman Algını Ölç',
  description:
    'Bilimsel verilere dayanan kör kronometre testi ile zaman algı sapma oranını öğren. Ekran süresi, uyku ve kısa video tüketiminin odağına etkisini keşfet.',
  keywords: ['zaman algısı', 'odak testi', 'dikkat', 'nörobilim', 'pomodoro', 'dijital sağlık'],
  openGraph: {
    title: 'TimePerception — Zaman Algını Ölç',
    description: 'Kör kronometre testi ile zaman algı sapma oranını hesapla.',
    type: 'website',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AppProvider>
          <Navbar />
          <main className="pt-16 min-h-screen flex flex-col">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
