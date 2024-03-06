/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useState, useEffect } from 'react'
import './App.css'
import SearchBar from './SearchBar'
import { debounce } from './util';
import SearchList from './SearchList';

const API_URL = `http://localhost:3000/api/search?query=`

function App() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState<string[]>(() => {
    const localCache = localStorage.getItem('searchHistory');
    return localCache ? JSON.parse(localCache) : [];
  });
  const [noResultFound, setNoResultFound] = useState(false);
  // API CALL
  const onSearch = async (searchQuery: string) => {
    setQuery(searchQuery);
    updateSearchHistory(searchQuery);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}${searchQuery}`);
      const data = await response.json();
      const results = data.query.search.map((result: any) => ({ title: result.title, desc: result.snippet }));
      setSearchResults(results);
      setIsLoading(false);
      results.length === 0 ? setNoResultFound(true) : setNoResultFound(false)
    } catch (error) {
      console.error('Error fetching data from Wikipedia API:', error);
      setIsLoading(false);
    }
  };
  const debouncedSearch = debounce(onSearch, 500);

  const updateSearchHistory = (newQuery: string) => {
    const newHistory = [newQuery, ...searchHistory.filter((item) => item !== newQuery)].slice(0, 3);
    setSearchHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  };

  useEffect(() => {
    setSearchResults([]);
  }, [query]);


  return (
    <>
      <h1>Welcome to WIKI </h1>
      <SearchBar onSearch={debouncedSearch} searchHistory={searchHistory} />
      {isLoading && <div className="loading-spinner" />}
      <SearchList data={searchResults} noResultFound={noResultFound} />
    </>
  )
}

export default App
