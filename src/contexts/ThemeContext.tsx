
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

type ThemeType = 'default' | 'minimal' | 'vibrant';

interface ThemeContextType {
  currentTheme: ThemeType;
  changeTheme: (theme: ThemeType) => void;
  nextTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('default');
  const { toast } = useToast();

  const themes: ThemeType[] = ['default', 'minimal', 'vibrant'];

  const changeTheme = (theme: ThemeType) => {
    setCurrentTheme(theme);
    toast({
      title: 'Theme Changed',
      description: `Switched to ${theme} theme`,
      duration: 2000,
    });
  };

  const nextTheme = () => {
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    changeTheme(themes[nextIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + Q for theme switching
      if (e.altKey && e.key === 'q') {
        e.preventDefault();
        nextTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, nextTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
