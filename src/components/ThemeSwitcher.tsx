
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Palette } from 'lucide-react';

const ThemeSwitcher: React.FC = () => {
  const { currentTheme, nextTheme } = useTheme();

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-sm font-medium text-gray-500">Current Theme: <span className="text-customizer-purple capitalize">{currentTheme}</span></h3>
        <p className="text-xs text-gray-400 mt-1">Press Alt+Q to switch themes</p>
      </div>
      <Button 
        onClick={nextTheme} 
        variant="outline" 
        size="sm"
        className="border-customizer-purple text-customizer-purple hover:bg-customizer-light-purple"
      >
        <Palette className="mr-2 h-4 w-4" />
        Switch Theme
      </Button>
    </div>
  );
};

export default ThemeSwitcher;
