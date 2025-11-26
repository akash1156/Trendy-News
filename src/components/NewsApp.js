import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Card from './Card';
import Footer from './Footer';
import Header from './Header';
import './NewsApp.css';

const NewsApp = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);

  // Get API key from environment variable
  const API_KEY = process.env.REACT_APP_NEWS_API_KEY;
  const articlesPerPage = 12;

  const categories = [
    'general', 'business', 'entertainment', 'health', 
    'science', 'sports', 'technology'
  ];

  // Map categories to GNews API topics
  const categoryToTopic = {
    'general': 'breaking-news',
    'business': 'business',
    'entertainment': 'entertainment',
    'health': 'health',
    'science': 'science',
    'sports': 'sports',
    'technology': 'technology'
  };

  const fetchNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    // Check if API key exists
    if (!API_KEY) {
      setError('API key is missing. Please add REACT_APP_NEWS_API_KEY to your environment variables in Vercel.');
      setLoading(false);
      setArticles([]);
      return;
    }

    try {
      console.log('Fetching news for category:', category);
      const topic = categoryToTopic[category] || 'breaking-news';
      
      // GNews API endpoint
      const response = await axios.get(
        `https://gnews.io/api/v4/top-headlines`,
        {
          params: {
            category: topic,
            lang: 'en',
            country: 'us',
            max: 100,
            apikey: API_KEY
          }
        }
      );
      
      console.log('API Response:', response.data);
      
      // Check if articles exist
      if (response.data.articles && response.data.articles.length > 0) {
        // Process and validate articles
        const processedArticles = response.data.articles
          .map(article => ({
            title: article.title || 'Untitled Article',
            description: article.description || 'No description available.',
            source: {
              name: article.source?.name || 'Unknown Source'
            },
            // GNews uses 'image' property
            urlToImage: article.image || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=200&fit=crop',
            url: article.url || '#',
            publishedAt: article.publishedAt || new Date().toISOString()
          }))
          .filter(article => 
            // Filter out removed or invalid articles
            article.title !== "[Removed]" && 
            article.description !== "[Removed]" &&
            article.title.trim() !== "" &&
            article.url !== '#'
          );
        
        console.log('Valid articles:', processedArticles.length);
        
        if (processedArticles.length > 0) {
          setArticles(processedArticles);
        } else {
          setError('No valid articles found. Please try a different category.');
          setArticles([]);
        }
      } else {
        setError('No articles available at the moment. Please try again later.');
        setArticles([]);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      
      let errorMessage = 'Failed to fetch news. ';
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage += 'Invalid API key. Please check your GNews API key in Vercel environment variables.';
            break;
          case 429:
            errorMessage += 'Rate limit exceeded. Please try again later.';
            break;
          case 403:
            errorMessage += 'Access forbidden. Please verify your API key permissions.';
            break;
          default:
            errorMessage += `Server error: ${error.response.status}. Please try again later.`;
        }
      } else if (error.request) {
        errorMessage += 'Network error. Please check your internet connection.';
      } else {
        errorMessage += error.message;
      }
      
      setError(errorMessage);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, [category, API_KEY]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const searchNews = async () => {
    if (!searchTerm.trim()) {
      setError('Please enter a search term.');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    if (!API_KEY) {
      setError('API key is missing. Please add REACT_APP_NEWS_API_KEY to your environment variables.');
      setLoading(false);
      return;
    }
    
    try {
      console.log('Searching for:', searchTerm);
      
      const response = await axios.get(
        `https://gnews.io/api/v4/search`,
        {
          params: {
            q: searchTerm,
            lang: 'en',
            country: 'us',
            max: 100,
            apikey: API_KEY
          }
        }
      );
      
      console.log('Search results:', response.data);
      
      if (response.data.articles && response.data.articles.length > 0) {
        const processedArticles = response.data.articles
          .map(article => ({
            title: article.title || 'Untitled Article',
            description: article.description || 'No description available.',
            source: {
              name: article.source?.name || 'Unknown Source'
            },
            urlToImage: article.image || 'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400&h=200&fit=crop',
            url: article.url || '#',
            publishedAt: article.publishedAt || new Date().toISOString()
          }))
          .filter(article => 
            article.title !== "[Removed]" && 
            article.description !== "[Removed]" &&
            article.title.trim() !== "" &&
            article.url !== '#'
          );
        
        if (processedArticles.length > 0) {
          setArticles(processedArticles);
        } else {
          setError(`No results found for "${searchTerm}". Try different keywords.`);
          setArticles([]);
        }
      } else {
        setError(`No results found for "${searchTerm}". Try different keywords.`);
        setArticles([]);
      }
    } catch (error) {
      console.error('Error searching news:', error);
      
      let errorMessage = 'Search failed. ';
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage += 'Invalid API key.';
            break;
          case 429:
            errorMessage += 'Rate limit exceeded. Please try again later.';
            break;
          default:
            errorMessage += 'Please try again later.';
        }
      } else {
        errorMessage += 'Please check your connection and try again.';
      }
      
      setError(errorMessage);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchTerm('');
    setCurrentPage(1);
    setError(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchNews();
    setCurrentPage(1);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Pagination logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articles.length / articlesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className={`news-app ${darkMode ? 'dark-mode' : ''}`}>
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        handleSearch={handleSearch}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        category={category}
        handleCategoryChange={handleCategoryChange}
        categories={categories}
      />

      <main className="main">
        <div className="container">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading latest news...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <h3>⚠️ Error</h3>
              <p>{error}</p>
              <button 
                onClick={fetchNews} 
                className="retry-btn"
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Retry
              </button>
              {!API_KEY && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
                  <strong>Setup Instructions:</strong>
                  <ol style={{ textAlign: 'left', marginTop: '10px' }}>
                    <li>Go to Vercel Dashboard → Your Project → Settings → Environment Variables</li>
                    <li>Add a new variable: <code>REACT_APP_NEWS_API_KEY</code></li>
                    <li>Enter your GNews API key as the value</li>
                    <li>Redeploy your application</li>
                  </ol>
                </div>
              )}
            </div>
          ) : (
            <>
              {articles.length > 0 ? (
                <div className="news-grid">
                  {currentArticles.map((article, index) => (
                    <Card key={`${article.url}-${index}`} article={article} />
                  ))}
                </div>
              ) : (
                <div className="loading">
                  <p>No articles found. Try a different search term or category.</p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  
                  {[...Array(Math.min(totalPages, 5))].map((_, index) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = index + 1;
                    } else if (currentPage <= 3) {
                      pageNum = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + index;
                    } else {
                      pageNum = currentPage - 2 + index;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => paginate(pageNum)}
                        className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NewsApp;