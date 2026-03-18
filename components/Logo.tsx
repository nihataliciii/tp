export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        className="w-12 h-12 md:w-14 md:h-14"
        style={{ filter: 'drop-shadow(0 0 8px rgba(124,58,237,0.3))' }}
      >
        <circle cx="50" cy="50" r="48" fill="transparent" stroke="url(#logoGradient)" strokeWidth="2" />

        <path
          d="M50 8 A42 42 0 1 1 50 92 A42 42 0 1 1 50 8 Z"
          fill="transparent"
          stroke="url(#logoGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        <rect x="46" y="2" width="8" height="6" rx="1" fill="url(#logoGradient)" />
        <rect x="35" y="4" width="4" height="4" rx="1" fill="url(#logoGradient)" transform="rotate(-30 37 6)" />
        <rect x="61" y="4" width="4" height="4" rx="1" fill="url(#logoGradient)" transform="rotate(30 63 6)" />

        <path
          d="M40 30 C35 30, 32 35, 30 40 L35 45 C38 42, 40 40, 43 40 Z"
          fill="transparent"
          stroke="url(#logoGradient)"
          strokeWidth="0.8"
        />
        <path
          d="M60 30 C65 30, 68 35, 70 40 L65 45 C62 42, 60 40, 57 40 Z"
          fill="transparent"
          stroke="url(#logoGradient)"
          strokeWidth="0.8"
        />
        <path
          d="M30 60 C25 60, 22 65, 20 70 L25 75 C28 72, 30 70, 33 70 Z"
          fill="transparent"
          stroke="url(#logoGradient)"
          strokeWidth="0.8"
        />
        <path
          d="M70 60 C75 60, 78 65, 80 70 L75 75 C72 72, 70 70, 67 70 Z"
          fill="transparent"
          stroke="url(#logoGradient)"
          strokeWidth="0.8"
        />

        <line x1="50" y1="50" x2="50" y2="35" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
        <line x1="50" y1="50" x2="65" y2="50" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />

        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#9d00ff', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#00ffff', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
