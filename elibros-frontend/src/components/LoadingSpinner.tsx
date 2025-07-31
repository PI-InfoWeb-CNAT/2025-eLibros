interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'md', 
  color = '#FFD147',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-4'
  };

  return (
    <div 
      className={`${sizeClasses[size]} border-t-transparent rounded-full animate-spin ${className}`}
      style={{ borderColor: color, borderTopColor: 'transparent' }}
    />
  );
}
