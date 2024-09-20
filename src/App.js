import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Navbar from './components/Navbar';
import NewsCard from './components/NewsCard';
import Pagination from './components/Pagination';
import './App.css';

const API_KEY = '94803704ea3d48ddb0afb5c1f6ec8592';  // Your new API key

const App = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [theme, setTheme] = useState('light');
  const [query, setQuery] = useState('general');
  const [totalResults, setTotalResults] = useState(0);
  const [currentCategory, setCurrentCategory] = useState('general'); // Track current category

  const fetchNews = async (query = 'general', currentPage = 1) => {
    try {
      const res = await axios.get(
        `https://newsapi.org/v2/everything?q=${query}&page=${currentPage}&pageSize=12&apiKey=${API_KEY}`
      );
  
      const validArticles = res.data.articles.filter(article =>
        article.title && article.urlToImage && article.content
      );
  
      setArticles(validArticles);
      setTotalResults(res.data.totalResults);
  
      const maxResults = res.data.totalResults > 100 ? 100 : res.data.totalResults;
      setTotalPages(Math.ceil(maxResults / 12));
  
      return {
        articles: validArticles,
        totalPages: Math.ceil(maxResults / 12)
      }; // Return articles and totalPages
    } catch (error) {
      if (error.response && error.response.status === 429) {
        console.error('Rate limit exceeded. Retrying in 10 seconds...');
        setTimeout(() => fetchNews(query, currentPage), 10000);
      } else {
        console.error('Error fetching news:', error);
      }
      return { articles: [], totalPages: 1 }; // Return default values in case of error
    }
  };
  

  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    setCurrentCategory(newQuery); // Update current category on search
    setPage(1);
    fetchNews(newQuery, 1);
  };

  const handleCategoryChange = (category) => {
    setCurrentCategory(category); // Update current category on category change
    setQuery(category); // Update query to match selected category
    setPage(1);
    fetchNews(category, 1);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
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
          onCategoryChange={handleCategoryChange} // Pass category change handler to Navbar
        />
        <Routes>
          <Route path="/category/:category" element={
            <CategoryPage 
              fetchNews={fetchNews} 
              category={currentCategory}
              page={page}
              setPage={setPage}
            />
          } />
          <Route path="/" element={
            <div className="news-wrapper">
              <div className="news-content">
                {articles.length > 0 ? (
                  articles.map((article, index) => (
                    <NewsCard key={index} article={article} />
                  ))
                ) : (
                  <p>No articles found</p>
                )}
              </div>
              <Pagination page={page} totalPages={totalPages} setPage={setPage} />
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

const CategoryPage = ({ fetchNews, category, page, setPage }) => {
  const [articles, setArticles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCategoryNews = async () => {
      try {
        const res = await fetchNews(category, page); // Fetch news for the selected category and page
        setArticles(res.articles || []);
        setTotalPages(res.totalPages || 1);
      } catch (error) {
        console.error('Error fetching category news:', error);
      }
    };

    fetchCategoryNews();
  }, [category, page, fetchNews]);

  return (
    <div className="news-wrapper">
      <div className="news-content">
        {articles.length > 0 ? (
          articles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))
        ) : (
          <p>No articles found</p>
        )}
      </div>
      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default App;
