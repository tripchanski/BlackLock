import { useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useStore } from '../services/store';
import { getTheme, Theme } from '../constants/themes';

export function useTheme(): Theme {
  const { settings } = useStore();
  const systemColorScheme = useColorScheme();

  const theme = useMemo(() => {
    let mode: 'light' | 'dark' = 'dark';

    if (settings.theme.mode === 'auto') {
      mode = systemColorScheme === 'dark' ? 'dark' : 'light';
    } else {
      mode = settings.theme.mode;
    }

    return getTheme(mode, settings.theme.color);
  }, [settings.theme.mode, settings.theme.color, systemColorScheme]);

  return theme;
}
