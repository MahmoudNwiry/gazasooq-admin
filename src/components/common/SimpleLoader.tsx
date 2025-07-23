import React from 'react';

interface SimpleLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'brand' | 'white' | 'gray';
  text?: string;
}

const SimpleLoader: React.FC<SimpleLoaderProps> = ({ 
  size = 'md', 
  color = 'brand',
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const colorClasses = {
    brand: 'border-brand-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    gray: 'border-gray-500 border-t-transparent'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <div 
        className={`
          ${sizeClasses[size]} 
          ${colorClasses[color]} 
          border-2 rounded-full animate-spin
        `}
      ></div>
      {text && (
        <span className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400`}>
          {text}
        </span>
      )}
    </div>
  );
};

export default SimpleLoader;
