import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import { ThemeContext } from '../contexts/ThemeContext';

const ThemeToggler = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <Button 
      variant={theme === 'dark' ? 'light' : 'dark'} 
      size="sm" 
      onClick={toggleTheme}
      className="d-flex align-items-center"
      title={theme === 'dark' ? 'Passer au mode clair' : 'Passer au mode sombre'}
    >
      {theme === 'dark' ? (
        <>
          <i className="bi bi-sun-fill me-1"></i>
          <span className="d-none d-md-inline">Mode clair</span>
        </>
      ) : (
        <>
          <i className="bi bi-moon-fill me-1"></i>
          <span className="d-none d-md-inline">Mode sombre</span>
        </>
      )}
    </Button>
  );
};

export default ThemeToggler;
