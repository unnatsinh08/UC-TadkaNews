import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onSearch, toggleTheme, onCategoryChange }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    onCategoryChange(category); // Use passed in handler
    navigate(`/category/${category}`);
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={handleLogoClick}>
        <img src="/logo.png" alt="UC-News-App Logo" />
      </div>
      <div className="categories">
        {['General', 'Business', 'Entertainment', 'Health', 'Science', 'Sports', 'Technology'].map(category => (
          <button key={category} onClick={() => handleCategoryClick(category.toLowerCase())}>
            {category}
          </button>
        ))}
      </div>
      <div className="right-section">
        <form onSubmit={(e) => { e.preventDefault(); onSearch(e.target.elements.query.value); }}>
          <input type="text" name="query" placeholder="Search..." />
          <button type="submit">Search</button>
        </form>
        <button className="dark-mode-toggle" onClick={toggleTheme}>🌙/🌞</button>
      </div>
    </nav>
  );
};

export default Navbar;
