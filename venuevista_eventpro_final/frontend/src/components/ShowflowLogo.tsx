import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtitle?: string;
  darkText?: boolean;
}

export const ShowflowIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8 11.5a4 4 0 0 1 4-4h24a4 4 0 0 1 4 4v5a5.5 5.5 0 0 0 0 11v5a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4v-5a5.5 5.5 0 0 0 0-11v-5Z" fill="#F6F3EB" />
    <path d="M17 12v21" stroke="#3157E8" strokeWidth="2" strokeDasharray="2.5 3" />
    <path d="M23 16h10M23 22h10M23 28h7" stroke="#3157E8" strokeWidth="2.8" strokeLinecap="round" />
    <path d="m35 10 1.1 2.1 2.4.4-1.7 1.7.4 2.4-2.2-1.1-2.1 1.1.4-2.4-1.8-1.7 2.4-.4L35 10Z" fill="#FF7859" />
  </svg>
);

export const ShowflowLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  subtitle,
  darkText = true,
}) => {
  const boxSizes = {
    sm: 'w-7 h-7 rounded-lg',
    md: 'w-9 h-9 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
    xl: 'w-28 h-28 rounded-3xl',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-5xl',
  };

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className={`${boxSizes[size]} bg-[#3157e8] flex items-center justify-center shrink-0 shadow-sm border border-[#2447d0] relative overflow-hidden`}>
        <ShowflowIcon className={size === 'xl' ? 'w-20 h-20' : size === 'lg' ? 'w-9 h-9' : 'w-6 h-6'} />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <div className={`font-brand font-bold tracking-tight ${textSizes[size]}`}>
            <span className="text-[#3157e8]">show</span>
            <span className={darkText ? 'text-[#1b1d29]' : 'text-white'}>flow</span>
          </div>
          {subtitle && (
            <span className={`text-[10px] font-medium tracking-tight mt-0.5 ${darkText ? 'text-[#737785]' : 'text-slate-300'}`}>
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const ShowflowBrandSplash: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 bg-[#1b1d29] flex flex-col items-center justify-center p-6 select-none" onClick={onClose}>
    <div className="relative flex flex-col items-center gap-5 px-8 py-10 text-center">
      <ShowflowIcon className="w-28 h-28 md:w-36 md:h-36" />
      <div className="font-display text-5xl md:text-7xl flex items-center">
        <span className="text-[#b8c5ff]">show</span>
        <span className="text-white">flow</span>
      </div>
    </div>
    <p className="mt-3 text-[#c3c6d2] text-sm font-medium">Find the room. Feel the moment.</p>
    <button onClick={onClose} className="mt-8 px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-medium border border-white/15 transition-colors cursor-pointer">
      Return to Workspace
    </button>
  </div>
);