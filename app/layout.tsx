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
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-gray-100 min-h-screen">
        <AppProvider>
          <Navbar />
          {/* pt-24 ensures NO OVERLAPPING with the fixed Navbar globally */}
          <main className="pt-24 min-h-[calc(100vh-64px)] flex flex-col w-full">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
