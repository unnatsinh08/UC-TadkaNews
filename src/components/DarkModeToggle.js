import React from 'react';

const DarkModeToggle = ({ theme, toggleTheme }) => {
  return (
    <button onClick={toggleTheme} className="dark-mode-toggle">
      {theme === 'light' ? '🌞' : '🌜'}
    </button>
  );
};

export default DarkModeToggle;
