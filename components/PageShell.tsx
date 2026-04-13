/**
 * PageShell — Global layout wrapper
 * 
 * Kullanım: Her page.tsx'de içerik <PageShell> ile sarılır.
 * Otomatik olarak:
 *  - max-w-7xl merkezi hizalama
 *  - Responsive yatay padding
 *  - Arka plan bg-primary
 *  - Navbar overflow'unu önleyen dikey padding
 */

interface PageShellProps {
  children: React.ReactNode;
  /** İçeriği tam ekran yapmak için (hero gibi sayfalar) */
  fullWidth?: boolean;
  className?: string;
}

export default function PageShell({ children, fullWidth = false, className = '' }: PageShellProps) {
  return (
    <div
      className={`w-full min-h-[calc(100vh-80px)] ${className}`}
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      {fullWidth ? (
        children
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
          {children}
        </div>
      )}
    </div>
  );
}
