interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
};

const iconSizes = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

function SparkIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" />
    </svg>
  );
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} rounded-full bg-primary-600 shadow-md flex items-center justify-center flex-shrink-0`}>
        <SparkIcon size={iconSizes[size]} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-bold text-dark-900 tracking-tight`}>
            Spark<span className="text-primary-600">Light</span>
          </span>
          {size !== 'sm' && (
            <span className="text-xs text-gray-500 tracking-wider uppercase">
              Hospital ERP
            </span>
          )}
        </div>
      )}
    </div>
  );
}
