import React from "react";
import { Link } from "react-router-dom";
import "./ArticleList.css";
import { useGetArticlesQuery } from "../features/articlesApi";

const ArticleList = () => {
  const { data: articles, error, isLoading } = useGetArticlesQuery();

  if (isLoading) {
    return <div className="loading">Loading articles...</div>;
  }

  if (error) {
    return <div className="error-message">Error loading articles: {error.message}</div>;
  }

  if (!articles?.articles?.length) {
    return <div className="no-articles">No articles found</div>;
  }

  return (
    <div className="article-list">
      {articles.articles.map((article) => (
        <article key={article.slug} className="article-preview">
          <div className="article-meta">
            <Link to={`/profile/${article.author.username}`}>
              <img src={article.author.image} alt={article.author.username} />
            </Link>
            <div className="info">
              <Link to={`/profile/${article.author.username}`} className="author">
                {article.author.username}
              </Link>
              <span className="date">{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
            <button className="btn btn-sm pull-xs-right">
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