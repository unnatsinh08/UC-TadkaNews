import React from 'react';

const NewsCard = ({ article }) => {
  const { urlToImage, title, description, url } = article;

  return (
    <div className="news-card">
      <img 
        src={urlToImage || 'https://via.placeholder.com/150'}  // Placeholder for missing images
        alt={title} 
      />
      <div className="news-info">
        <h3>{title}</h3>
        <p>{description}</p>
        <a href={url} target="_blank" rel="noopener noreferrer">Read more</a>
      </div>
    </div>
  );
};

export default NewsCard;
