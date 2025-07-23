import React from 'react';

/**
 * Professional Loading Screen Component
 * 
 * @param title - Main title text (default: "سوق إكسبرس")
 * @param subtitle - Subtitle text (default: "جارٍ التحقق من صحة البيانات...")
 * @param showProgress - Show animated progress bar (default: true)
 * @param showDots - Show bouncing dots (default: true)
 * @param theme - Theme variant: 'default' | 'minimal' (default: 'default')
 */
interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  showProgress?: boolean;
  showDots?: boolean;
  theme?: 'default' | 'minimal';
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  title = "سوق إكسبرس", 
  subtitle = "جارٍ التحقق من صحة البيانات...",
  showProgress = true,
  showDots = true,
  theme = 'default'
}) => {
  // Minimal theme for simple loading scenarios
  if (theme === 'minimal') {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          {/* Simple Logo */}
          <div className="mb-6">
            <div className="w-16 h-16 bg-brand-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
          
          {/* Simple Text */}
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{subtitle}</p>
        </div>
      </div>
    );
  }

  // Default full-featured theme with animations and effects
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-brand-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Logo Container */}
        <div className="mb-8">
          <div className="relative inline-block">
            {/* Outer rotating ring */}
            <div className="w-24 h-24 border-4 border-brand-200 dark:border-brand-800 rounded-full animate-spin"></div>
            
            {/* Inner rotating ring */}
            <div className="absolute top-2 left-2 w-20 h-20 border-4 border-t-brand-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
            
            {/* Center logo */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 animate-pulse">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 animate-pulse" style={{ animationDelay: '1s' }}>
            {subtitle}
          </p>
        </div>

        {/* Loading Progress Bar */}
        {showProgress && (
          <div className="w-64 mx-auto mb-8">
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-brand-500 to-brand-600 h-full rounded-full shadow-sm"
                style={{
                  animation: 'loading-bar 2s ease-in-out infinite',
                }}
              ></div>
            </div>
          </div>
        )}

        {/* Loading Dots */}
        {showDots && (
          <div className="flex justify-center space-x-1 rtl:space-x-reverse">
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}

        {/* Floating Elements */}
        <div 
          className="absolute top-20 left-20 w-2 h-2 bg-brand-400 rounded-full opacity-60"
          style={{
            animation: 'float 3s ease-in-out infinite',
          }}
        ></div>
        <div 
          className="absolute top-32 right-32 w-1 h-1 bg-purple-400 rounded-full opacity-60"
          style={{
            animation: 'float 3s ease-in-out infinite',
            animationDelay: '1s'
          }}
        ></div>
        <div 
          className="absolute bottom-40 left-40 w-3 h-3 bg-yellow-400 rounded-full opacity-60"
          style={{
            animation: 'float 3s ease-in-out infinite',
            animationDelay: '2s'
          }}
        ></div>
        <div 
          className="absolute bottom-20 right-20 w-2 h-2 bg-green-400 rounded-full opacity-60"
          style={{
            animation: 'float 3s ease-in-out infinite',
            animationDelay: '3s'
          }}
        ></div>
      </div>

      {/* CSS Animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes loading-bar {
            0% { width: 0%; }
            50% { width: 60%; }
            100% { width: 100%; }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
        `
      }} />
    </div>
  );
};

export default LoadingScreen;
