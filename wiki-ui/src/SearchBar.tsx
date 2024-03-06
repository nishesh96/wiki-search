import React, { useState, useEffect } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  searchHistory: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchHistory }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    onSearch(event.target.value);
  };

  const handleSearchClick = () => {
    onSearch(searchQuery);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownItemClick = (historyItem: string) => {
    setSearchQuery(historyItem);
    setIsDropdownOpen(false);
  };



  useEffect(() => {
    const handleFocusOutside = (event: MouseEvent) => {
      if (event.target instanceof Element && !event.target.closest('.search-dropdown')) {
        setIsDropdownOpen(false);
      }
    };
    const searchBar = document.getElementById('search-input');
    searchBar?.addEventListener('mouseenter', handleDropdownToggle);

    searchBar?.addEventListener('mouseleave', handleFocusOutside);

    return () => {
      searchBar?.removeEventListener('mouseenter', handleDropdownToggle);
      searchBar?.removeEventListener('mouseleave', handleFocusOutside);
    };
  }, []);

  return (
    <div className='search'>
      <div className="search-bar">
        <input
          id="search-input"
          type="text"
          placeholder="Enter your search..."
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleDropdownToggle}
        />
        <button onClick={handleSearchClick}>Search</button>
      </div>
      {
        searchHistory.length > 0 && isDropdownOpen && (
          <div className="search-dropdown">
            {searchHistory.map((historyItem, index) => (
              <div
                key={index}
                className="dropdown-item"
                onClick={() => handleDropdownItemClick(historyItem)}
              >
                {historyItem}
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
};

export default SearchBar;