import React from "react";
import { Link } from "react-router-dom";
import "./ArticleList.css";
import { useGetArticlesQuery, useFavoriteArticleMutation, useUnfavoriteArticleMutation } from "../features/articlesApi";
import { useSelector } from 'react-redux';

const ArticleList = () => {
  const { data: articlesData, isLoading } = useGetArticlesQuery();
  const [favoriteArticle] = useFavoriteArticleMutation();
  const [unfavoriteArticle] = useUnfavoriteArticleMutation();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const handleFavorite = async (slug, favorited) => {
    try {
      if (!isAuthenticated) {
        return;
      }
      if (favorited) {
        await unfavoriteArticle(slug).unwrap();
      } else {
        await favoriteArticle(slug).unwrap();
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading articles...</div>;
  }

  if (!articlesData?.articles?.length) {
    return <div className="no-articles">No articles found</div>;
  }

  return (
    <div className="article-list">
      {articlesData.articles.map((article) => (
        <article key={article.slug} className="article-preview">
          <div className="article-meta">
            <Link to={`/profile/${article.author.username}`}>
              <img src={article.author.image || 'https://api.realworld.io/images/smiley-cyrus.jpeg'} alt={article.author.username} />
            </Link>
            <div className="info">
              <Link to={`/profile/${article.author.username}`} className="author">
                {article.author.username}
              </Link>
              <span className="date">{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
            <button
              className={`btn btn-sm pull-xs-right ${article.favorited ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handleFavorite(article.slug, article.favorited)}
              disabled={!isAuthenticated}
            >
              <i className="ion-heart"></i> {article.favoritesCount}
            </button>
          </div>
          <Link to={`/article/${article.slug}`} className="preview-link">
            <h1>{article.title}</h1>
            <p>{article.description}</p>
            <span>Read more...</span>
            <ul className="tag-list">
              {article.tagList.map((tag) => (
                <li key={tag} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </Link>
        </article>
      ))}
    </div>
  );
};

export default ArticleList; 