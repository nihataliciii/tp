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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head />
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-gray-100 min-h-screen">
        <AppProvider>
          <Navbar />
          <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            {/* Solid spacer equal to fixed Navbar height (64px) + extra breathing room */}
            <div className="h-20 w-full flex-shrink-0 pointer-events-none" />
            <div className="w-full flex flex-col items-center">
              {children}
            </div>
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
