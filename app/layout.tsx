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
      <body>
        <AppProvider>
          <Navbar />
          <main className="pt-32 min-h-screen flex flex-col">
            {children}
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
