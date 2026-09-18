import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  variant?: 'light' | 'dark' | 'gold';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  href?: string;
  className?: string;
}

export default function BrandLogo({
  variant = 'dark',
  size = 'md',
  href = '/',
  className = '',
}: BrandLogoProps) {
  const isLight = variant === 'light';

  // Sizing heights for crisp rendering
  const sizeClasses = {
    sm: 'h-10 sm:h-11 w-auto max-w-[150px]',
    md: 'h-12 sm:h-14 w-auto max-w-[190px]',
    lg: 'h-16 sm:h-20 w-auto max-w-[240px]',
    xl: 'h-24 sm:h-28 w-auto max-w-[320px]',
  }[size];

  const content = (
    <div
      className={`inline-flex items-center justify-center transition-transform duration-200 hover:scale-[1.02] ${
        isLight
          ? 'bg-white/95 px-3.5 py-1.5 rounded-2xl shadow-soft border border-sand-200/60 backdrop-blur-sm'
          : ''
      } ${className}`}
    >
      <img
        src="/images/logo.png"
        alt="Shez Blooming Massage & Parlour"
        className={`${sizeClasses} object-contain`}
      />
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="inline-flex items-center shrink-0">
      {content}
    </Link>
  );
}
