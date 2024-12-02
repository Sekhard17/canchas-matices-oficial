import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSun, faMoon, faDesktop } from '@fortawesome/free-solid-svg-icons';

type Theme = 'light' | 'dark' | 'system';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('theme') as Theme) || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    localStorage.setItem('theme', theme);
  }, [theme]);

  const icons = {
    light: <FontAwesomeIcon icon={faSun} className="w-5 h-5" />,
    dark: <FontAwesomeIcon icon={faMoon} className="w-5 h-5" />,
    system: <FontAwesomeIcon icon={faDesktop} className="w-5 h-5" />
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        onClick={() => {
          const modes: Theme[] = ['light', 'dark', 'system'];
          const currentIndex = modes.indexOf(theme);
          const nextIndex = (currentIndex + 1) % modes.length;
          setTheme(modes[nextIndex]);
        }}
        aria-label={`Current theme: ${theme}`}
      >
        {icons[theme]}
        <span className="capitalize">{theme}</span>
      </button>
    </div>
  );
};

export default ThemeToggle;