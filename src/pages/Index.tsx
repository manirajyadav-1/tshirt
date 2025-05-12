
import React from 'react';
import TShirtCustomizer from '@/components/TShirtCustomizer';
import { useTheme } from '@/contexts/ThemeContext';

const Index = () => {
  const { currentTheme } = useTheme();

  // Get background class based on theme
  const getBackgroundClass = () => {
    switch (currentTheme) {
      case 'minimal':
        return 'bg-gray-100';
      case 'vibrant':
        return 'bg-gradient-to-br from-customizer-light-purple via-white to-customizer-light-purple';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className={`min-h-screen py-8 md:py-12 transition-all duration-500 ${getBackgroundClass()}`}>
      <div className="container">
        <TShirtCustomizer />
        <div className="text-center text-gray-500 text-xs mt-8">
          Press <span className="font-mono bg-gray-100 px-2 py-1 rounded">Alt + Q</span> to switch between design themes
        </div>
      </div>
    </div>
  );
};

export default Index;
