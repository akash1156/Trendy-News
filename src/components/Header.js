
import React, { useState, useEffect, useRef } from 'react';
import './NewsApp.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
const Header = ({ 
  searchTerm, 
  setSearchTerm, 
  handleSearch, 
  darkMode, 
  toggleDarkMode,
  category,
  handleCategoryChange,
  categories
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCategoryClick = (cat) => {
    handleCategoryChange(cat);
    setIsMenuOpen(false); // Close menu after selection
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    // Add event listener when menu is open
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Cleanup event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo Section */}
          <div className="logo-section">
            <h1 className="logo">
              <i className="fas fa-newspaper logo-icon"></i>
              <span className="logo-text">
                <span className="logo-main">Trendy</span>
                <span className="logo-sub">News</span>
              </span>
            </h1>
            <p className="tagline">Stay informed, stay ahead</p>
          </div>
          
          {/* Header Controls */}
          <div className="header-controls">
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="search-btn">
                  <FontAwesomeIcon icon={faSearch} className="search-icon" />
                </button>
              </div>
            </form>
            
            <div className="header-actions" ref={menuRef}>
              <button onClick={toggleDarkMode} className="theme-toggle" title="Toggle theme">
                <span className="theme-icon">{darkMode ? '☀️' : '🌙'}</span>
              </button>
              
              {/* Three Dot Menu Button */}
              <button onClick={toggleMenu} className="menu-toggle" title="Menu">
                <span className="menu-icon">⋯</span>
              </button>
              
              {/* Dropdown Menu */}
              {isMenuOpen && (
                <div className="dropdown-menu">
                  <div className="menu-header">Categories</div>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className={`menu-item ${category === cat ? 'active' : ''}`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
