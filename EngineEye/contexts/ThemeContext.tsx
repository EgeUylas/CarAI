import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  primary: string;
  secondary: string;
  border: string;
  card: string;
}

interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  colorScheme: 'blue' | 'purple' | 'green' | 'orange' | 'red';
  isDark: boolean;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setColorScheme: (colorScheme: 'blue' | 'purple' | 'green' | 'orange' | 'red') => void;
  colors: ThemeColors;
}

const defaultColors = {
  light: {
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: '#000000',
    primary: '#4ECDC4',
    secondary: '#8F9BA8',
    border: '#E0E0E0',
    card: '#FFFFFF',
  },
  dark: {
    background: '#141F27',
    surface: '#1a252f',
    text: '#FFFFFF',
    primary: '#4ECDC4',
    secondary: '#8F9BA8',
    border: '#243240',
    card: '#1a252f',
  },
};

const colorSchemes = {
  blue: '#4ECDC4',
  purple: '#9B59B6',
  green: '#2ECC71',
  orange: '#E67E22',
  red: '#E74C3C',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
  const [colorScheme, setColorSchemeState] = useState<'blue' | 'purple' | 'green' | 'orange' | 'red'>('blue');

  useEffect(() => {
    loadThemePreferences();
  }, []);

  const loadThemePreferences = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      const savedColorScheme = await AsyncStorage.getItem('colorScheme');
      
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme as 'light' | 'dark' | 'system');
      }
      if (savedColorScheme && ['blue', 'purple', 'green', 'orange', 'red'].includes(savedColorScheme)) {
        setColorSchemeState(savedColorScheme as 'blue' | 'purple' | 'green' | 'orange' | 'red');
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
    }
  };

  const setTheme = async (newTheme: 'light' | 'dark' | 'system') => {
    try {
      await AsyncStorage.setItem('theme', newTheme);
      setThemeState(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const setColorScheme = async (newColorScheme: 'blue' | 'purple' | 'green' | 'orange' | 'red') => {
    try {
      await AsyncStorage.setItem('colorScheme', newColorScheme);
      setColorSchemeState(newColorScheme);
    } catch (error) {
      console.error('Error saving color scheme:', error);
    }
  };

  const isDark = theme === 'system' ? systemColorScheme === 'dark' : theme === 'dark';

  const colors: ThemeColors = {
    ...defaultColors[isDark ? 'dark' : 'light'],
    primary: colorSchemes[colorScheme],
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorScheme,
        isDark,
        setTheme,
        setColorScheme,
        colors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 