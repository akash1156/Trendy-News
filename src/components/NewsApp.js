import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Card from './Card';
import Footer from './Footer';
import Header from './Header';
import './NewsApp.css';

// Mock data moved outside component to prevent recreation on each render
console.log('API Key:', process.env.REACT_APP_NEWS_API_KEY);
const mockArticles = [
  {
    title: "Breaking: Revolutionary AI Technology Unveiled",
    description: "Scientists have developed a groundbreaking AI system that could change the way we interact with technology forever.",
    image: "https://via.placeholder.com/400x200?text=AI+Technology",
    publishedAt: "2025-06-17T10:30:00Z",
    source: { name: "Tech News" },
    url: "https://example.com/ai-technology"
  },
  {
    title: "Climate Change Summit Reaches Historic Agreement",
    description: "World leaders have signed a comprehensive agreement to combat climate change with unprecedented measures.",
    image: "https://via.placeholder.com/400x200?text=Climate+Summit",
    publishedAt: "2025-06-17T09:15:00Z",
    source: { name: "Global News" },
    url: "https://example.com/climate-summit"
  },
  {
    title: "Space Exploration Milestone Achieved",
    description: "NASA's latest mission has successfully landed on Mars, marking a new era in space exploration.",
    image: "https://via.placeholder.com/400x200?text=Mars+Mission",
    publishedAt: "2025-06-17T08:45:00Z",
    source: { name: "Space Today" },
    url: "https://example.com/mars-mission"
  },
  {
    title: "Medical Breakthrough in Cancer Treatment",
    description: "Researchers have discovered a new treatment method that shows promising results in early trials.",
    image: "https://via.placeholder.com/400x200?text=Medical+Research",
    publishedAt: "2025-06-17T07:20:00Z",
    source: { name: "Health Journal" },
    url: "https://example.com/cancer-treatment"
  },
  {
    title: "Economic Markets Show Strong Recovery",
    description: "Global markets are experiencing their strongest performance in years following new policy changes.",
    image: "https://via.placeholder.com/400x200?text=Stock+Market",
    publishedAt: "2025-06-17T06:00:00Z",
    source: { name: "Financial Times" },
    url: "https://example.com/market-recovery"
  },
  {
    title: "Revolutionary Electric Vehicle Launch",
    description: "A new electric vehicle with 1000-mile range capability is set to transform the automotive industry.",
    image: "https://via.placeholder.com/400x200?text=Electric+Car",
    publishedAt: "2025-06-17T05:30:00Z",
    source: { name: "Auto News" },
    url: "https://example.com/electric-vehicle"
  }
];

const NewsApp = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);

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
    
    if (!API_KEY) {
      console.warn('API key not found, using mock data');
      setArticles(mockArticles);
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching news for category:', category);
      const topic = categoryToTopic[category] || 'breaking-news';
      
      // Correct GNews API endpoint
      const response = await axios.get(
        `https://gnews.io/api/v4/top-headlines?category=${topic}&lang=en&country=us&max=100&apikey=${API_KEY}`
      );
      
      console.log('Full API Response:', response.data);
      console.log('Total results:', response.data.totalArticles);
      console.log('Articles received:', response.data.articles?.length || 0);
      
      // GNews API returns articles directly in response.data.articles
      if (response.data.articles && response.data.articles.length > 0) {
        // Process and clean the articles data
        const processedArticles = response.data.articles.map((article, index) => {
          console.log(`Article ${index + 1}:`, {
            title: article.title,
            source: article.source?.name,
            description: article.description?.substring(0, 50) + '...',
            hasImage: !!article.image,
            publishedAt: article.publishedAt
          });
          
          return {
            ...article,
            // Ensure we have fallback values
            title: article.title || 'No Title Available',
            description: article.description || 'No description available for this article.',
            source: {
              ...article.source,
              name: article.source?.name || 'Unknown Source'
            },
            // GNews uses 'image' instead of 'urlToImage'
            urlToImage: article.image || null,
            image: article.image || null,
            url: article.url || '#',
            publishedAt: article.publishedAt || new Date().toISOString()
          };
        }).filter(article => 
          // Filter out removed or invalid articles
          article.title !== "[Removed]" && 
          article.description !== "[Removed]" &&
          article.title !== "No Title Available" &&
          article.title && article.title.trim() !== ""
        );
        
        console.log('Processed articles count:', processedArticles.length);
        
        if (processedArticles.length > 0) {
          setArticles(processedArticles);
        } else {
          console.warn('No valid articles after processing, using mock data');
          setArticles(mockArticles);
        }
      } else {
        console.warn('API returned no articles, using mock data');
        setArticles(mockArticles);
      }
    } catch (error) {
      console.error('Error fetching news:', error);
      if (error.response) {
        console.error('API Error Response:', error.response.data);
        console.error('API Error Status:', error.response.status);
        
        if (error.response.status === 401) {
          console.error('Invalid API key. Please check your GNews API key.');
        } else if (error.response.status === 429) {
          console.error('Rate limit exceeded. Please try again later.');
        }
      }
      // Always fallback to mock data on error
      setArticles(mockArticles);
    } finally {
      setLoading(false);
    }
  }, [category, API_KEY]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const searchNews = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    
    if (!API_KEY) {
      console.warn('API key not found, using mock search');
      const searchResults = mockArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setArticles(searchResults);
      setLoading(false);
      return;
    }
    
    try {
      console.log('Searching for:', searchTerm);
      // GNews API search endpoint
      const response = await axios.get(
        `https://gnews.io/api/v4/search?q=${encodeURIComponent(searchTerm)}&lang=en&country=us&max=100&apikey=${API_KEY}`
      );
      
      console.log('Search API Response:', response.data);
      console.log('Search results count:', response.data.articles?.length || 0);
      
      if (response.data.articles && response.data.articles.length > 0) {
        const processedArticles = response.data.articles.map(article => ({
          ...article,
          title: article.title || 'No Title Available',
          description: article.description || 'No description available for this article.',
          source: {
            ...article.source,
            name: article.source?.name || 'Unknown Source'
          },
          // GNews uses 'image' instead of 'urlToImage'
          urlToImage: article.image || null,
          image: article.image || null,
          url: article.url || '#',
          publishedAt: article.publishedAt || new Date().toISOString()
        })).filter(article => 
          article.title !== "[Removed]" && 
          article.description !== "[Removed]" &&
          article.title !== "No Title Available" &&
          article.title && article.title.trim() !== ""
        );
        
        console.log('Processed search results:', processedArticles.length);
        
        if (processedArticles.length > 0) {
          setArticles(processedArticles);
        } else {
          console.warn('No valid search results, using mock search');
          const searchResults = mockArticles.filter(article =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.description.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setArticles(searchResults);
        }
      } else {
        console.warn('Search returned no results, using mock search');
        const searchResults = mockArticles.filter(article =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setArticles(searchResults);
      }
    } catch (error) {
      console.error('Error searching news:', error);
      if (error.response) {
        console.error('Search API Error:', error.response.data);
      }
      // Fallback to mock search
      const searchResults = mockArticles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setArticles(searchResults);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setSearchTerm('');
    setCurrentPage(1);
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
      {/* Header Component with Navigation */}
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

      {/* Main Content */}
      <main className="main">
        <div className="container">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Loading latest news...</p>
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

              {/* Pagination */}
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