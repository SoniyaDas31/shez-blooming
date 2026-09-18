import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export default function BrandLogo({
  variant = 'dark',
  size = 'md',
  showSubtitle = true,
}: BrandLogoProps) {
  const isLight = variant === 'light';

  const logoSize = {
    sm: { icon: 24, title: 'text-lg', sub: 'text-[9px]' },
    md: { icon: 32, title: 'text-2xl', sub: 'text-[11px]' },
    lg: { icon: 44, title: 'text-3xl sm:text-4xl', sub: 'text-xs sm:text-sm' },
  }[size];

  return (
    <Link href="/" className="inline-flex items-center gap-2.5 group transition-transform hover:scale-[1.01]">
      <div className="relative flex items-center justify-center">
        {/* Stylized Kerala Lotus Flower Icon */}
        <svg
          width={logoSize.icon}
          height={logoSize.icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:rotate-6"
        >
          {/* Lotus Petals */}
          <path
            d="M50 15C50 15 35 35 35 60C35 73.8 41.7 85 50 85C58.3 85 65 73.8 65 60C65 35 50 15 50 15Z"
            fill={isLight ? '#D4AF37' : '#D4AF37'}
            opacity="0.9"
          />
          <path
            d="M50 30C50 30 25 45 20 65C16.8 77.8 25 85 35 85C45 85 50 75 50 75C50 75 55 85 65 85C75 85 83.2 77.8 80 65C75 45 50 30 50 30Z"
            fill={isLight ? '#FAF7F2' : '#1B4332'}
            opacity="0.85"
          />
          <path
            d="M50 45C50 45 15 55 10 72C6.8 82.5 15 88 25 88C38 88 48 78 50 78C52 78 62 88 75 88C85 88 93.2 82.5 90 72C85 55 50 45 50 45Z"
            fill="#D4AF37"
            opacity="0.6"
          />
          <circle cx="50" cy="55" r="4" fill="#FAF7F2" />
        </svg>
      </div>

      <div className="flex flex-col">
        <span
          className={`font-serif-brand font-bold tracking-wide leading-tight ${logoSize.title} ${
            isLight ? 'text-cream-50' : 'text-forest-700'
          }`}
        >
          Shez <span className="text-gold-600 italic">Blooming</span>
        </span>
        {showSubtitle && (
          <span
            className={`font-sans uppercase tracking-[0.2em] font-medium leading-none mt-0.5 ${logoSize.sub} ${
              isLight ? 'text-sand-200' : 'text-stone-500'
            }`}
          >
            Massage & Parlour
          </span>
        )}
      </div>
    </Link>
  );
}
