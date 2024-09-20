import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import NewsCard from './components/NewsCard';
import Pagination from './components/Pagination';
import './App.css';

const API_KEY = '94803704ea3d48ddb0afb5c1f6ec8592'; // Your API key

const App = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [theme, setTheme] = useState('light');
  const [query, setQuery] = useState('general');

  const fetchNews = async (query = 'general', currentPage = 1) => {
    try {
      const res = await axios.get(`https://newsapi.org/v2/everything?q=${query}&page=${currentPage}&pageSize=12&apiKey=${API_KEY}`);
      const validArticles = res.data.articles.filter(article => article.title && article.urlToImage && article.content);
      
      setArticles(validArticles);
      setTotalPages(Math.ceil(res.data.totalResults / 12));
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setPage(1);
    fetchNews(newQuery, 1);
  };

  const handleCategoryChange = (category) => {
    setQuery(category);
    setPage(1);
    fetchNews(category, 1);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    document.body.className = theme === 'light' ? 'dark' : 'light';
  };

  useEffect(() => {
    fetchNews(query, page);
  }, [query, page]);

  return (
    <Router>
      <div className={`App ${theme}`}>
        <Navbar
          onSearch={handleSearch}
          toggleTheme={toggleTheme}
          onCategoryChange={handleCategoryChange}
        />
        <Routes>
          <Route path="/" element={
            <div className="news-wrapper">
              <div className="news-content">
                {articles.length > 0 ? articles.map((article, index) => (
                  <NewsCard key={index} article={article} />
                )) : <p>No articles found</p>}
              </div>
              <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
