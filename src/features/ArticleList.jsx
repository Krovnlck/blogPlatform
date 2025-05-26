import React, { useState, useMemo } from "react";
import "../components/ArticleList.css";
import { useGetArticlesQuery, useFavoriteArticleMutation, useUnfavoriteArticleMutation } from "./articlesApi";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

const PAGE_SIZE = 5;

const ArticleList = ({ isAuth }) => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const queryParams = useMemo(
    () => ({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE }),
    [page]
  );
  const { data, isLoading, error } = useGetArticlesQuery(queryParams);
  const [favoriteArticle] = useFavoriteArticleMutation();
  const [unfavoriteArticle] = useUnfavoriteArticleMutation();
  // Оставляем оба варианта для совместимости
  const isAuthenticated = useSelector(state => state?.auth?.isAuthenticated ?? false);

  const articles = data?.articles || [];
  const total = data?.articlesCount || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleLike = async (slug, favorited) => {
    try {
      if (!(isAuth ?? isAuthenticated)) {
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

  if (!articles.length) {
    return <div className="no-articles">No articles found</div>;
  }

  return (
    <>
      {error && <div className="error">{error.message || "Ошибка загрузки"}</div>}
      <div className="articles">
        {articles.map((article) => (
          <div className="article-card" key={article.slug}>
            <div className="article-main">
              <div>
                <a
                  href="#"
                  className="article-title"
                  onClick={e => {
                    e.preventDefault();
                    navigate(`/articles/${article.slug}`);
                  }}
                >
                  {article.title}
                </a>
                <span className="likes">
                  <span
                    className="like-icon"
                    style={{ color: article.favorited ? '#ff4d4f' : '#888', cursor: (isAuth ?? isAuthenticated) ? 'pointer' : 'not-allowed' }}
                    onClick={() => (isAuth ?? isAuthenticated) && handleLike(article.slug, article.favorited)}
                    title={(isAuth ?? isAuthenticated) ? (article.favorited ? 'Убрать лайк' : 'Поставить лайк') : 'Войдите, чтобы лайкать'}
                  >
                    {article.favorited ? '❤️' : '♡'}
                  </span>
                  {article.favoritesCount}
                </span>
                <div className="tags">
                  {article.tagList.map((tag, i) => (
                    <span className="tag" key={i}>{tag}</span>
                  ))}
                </div>
                <div className="description">{article.description}</div>
              </div>
              <div className="author-block">
                <div className="author-info">
                  <span className="author-name">{article.author.username}</span>
                  <span className="date">{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                <img className="avatar" src={article.author.image || 'https://api.realworld.io/images/smiley-cyrus.jpeg'} alt="avatar" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <footer className="pagination">
        <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>{'<'}</button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => {
            if (totalPages <= 5) return true;
            if (page <= 3) return p <= 5;
            if (page >= totalPages - 2) return p > totalPages - 5;
            return Math.abs(page - p) <= 2;
          })
          .map(p => (
            <button
              className={`page-btn${page === p ? ' active' : ''}`}
              key={p}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
        <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>{'>'}</button>
      </footer>
    </>
  );
};

export default ArticleList; 