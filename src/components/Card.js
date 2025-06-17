
import React, { useState } from 'react';

const Card = ({ article }) => {
  const [imageError, setImageError] = useState(false);

  // Debug log to see what data we're receiving
  console.log('Card received article:', {
    title: article?.title,
    source: article?.source?.name,
    hasImage: !!article?.urlToImage,
    publishedAt: article?.publishedAt
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Date not available';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date not available';
    }
  };

  const handleImageError = () => {
    console.log('Image failed to load for article:', article?.title);
    setImageError(true);
  };

  const shareArticle = (article) => {
    if (!article?.url || article.url === '#') {
      alert('Article link not available');
      return;
    }

    if (navigator.share) {
      navigator.share({
        title: article.title || 'News Article',
        text: article.description || '',
        url: article.url,
      }).catch(err => console.log('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(article.url).then(() => {
        alert('Article link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy link:', err);
        alert('Unable to copy link');
      });
    }
  };

  // Truncate description to ensure consistent card heights
  const truncateText = (text, maxLength = 150) => {
    if (!text) return 'No description available for this article.';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  // Safety check for article data
  if (!article) {
    return (
      <div className="card">
        <div className="card-content">
          <p>Article data not available</p>
        </div>
      </div>
    );
  }

  return (
    <article className="card">
      <div className="card-image-container">
        {!imageError && article.urlToImage ? (
          <img
            src={article.urlToImage}
            alt={article.title || 'News article'}
            className="card-image"
            onError={handleImageError}
            onLoad={() => console.log('Image loaded successfully for:', article.title)}
            loading="lazy"
          />
        ) : (
          <div className="card-image-placeholder">
            <div className="placeholder-content">
              <span className="placeholder-icon">📰</span>
              <span className="placeholder-text">No Image Available</span>
            </div>
          </div>
        )}
        
        <div className="card-overlay">
          <button
            onClick={() => shareArticle(article)}
            className="share-btn"
            title="Share article"
            aria-label="Share article"
          >
            <span className="share-icon">🔗</span>
          </button>
        </div>
      </div>

      <div className="card-content">
        <header className="card-header">
          <span className="card-source">
            {article.source?.name || 'Unknown Source'}
          </span>
          <time className="card-date" dateTime={article.publishedAt}>
            {formatDate(article.publishedAt)}
          </time>
        </header>

        <h2 className="card-title">
          {article.title || 'No Title Available'}
        </h2>

        <p className="card-description">
          {truncateText(article.description)}
        </p>

        <footer className="card-footer">
          <a
            href={article.url && article.url !== '#' ? article.url : '#'}
            target={article.url && article.url !== '#' ? "_blank" : "_self"}
            rel="noopener noreferrer"
            className="read-more-btn"
            onClick={(e) => {
              if (!article.url || article.url === '#') {
                e.preventDefault();
                alert('Article link not available');
              }
            }}
          >
            <span className="btn-text">Read More</span>
            <span className="btn-icon">→</span>
          </a>
        </footer>
      </div>
    </article>
  );
};

export default Card;
