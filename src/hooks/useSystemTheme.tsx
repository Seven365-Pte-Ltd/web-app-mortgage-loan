import { useState, useEffect } from 'react';

function useSystemTheme() {
  const [theme, setTheme] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  useEffect(() => {
    const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

    const listener = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light');
    };

    mediaQueryList.addEventListener('change', listener);

    return () => mediaQueryList.removeEventListener('change', listener);
  }, []);

  return theme;
}

export default useSystemTheme;
