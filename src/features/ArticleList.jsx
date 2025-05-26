import React, { useState } from "react";
import "../components/ArticleList.css";
import { useGetArticlesQuery, useFavoriteArticleMutation } from "./articlesApi";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 5;

const ArticleList = ({ isAuth }) => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetArticlesQuery({ limit: PAGE_SIZE, offset: (page - 1) * PAGE_SIZE });
  const [favoriteArticle] = useFavoriteArticleMutation();

  const articles = data?.articles || [];
  const total = data?.articlesCount || 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handleLike = async (slug, favorited) => {
    if (!isAuth || favorited) return;
    try {
      await favoriteArticle(slug).unwrap();
    } catch (e) {
      // Можно добавить обработку ошибки
    }
  };

  return (
    <>
      {isLoading && <div className="loading">Загрузка...</div>}
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
                    style={{ color: article.favorited ? '#ff4d4f' : '#888', cursor: isAuth ? 'pointer' : 'not-allowed' }}
                    onClick={() => handleLike(article.slug, article.favorited)}
                    title={isAuth ? (article.favorited ? 'Уже лайкнуто' : 'Поставить лайк') : 'Войдите, чтобы лайкать'}
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
                <img className="avatar" src={article.author.image} alt="avatar" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <footer className="pagination">
        <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>{'<'}</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            className={`page-btn${page === i + 1 ? ' active' : ''}`}
            key={i + 1}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
        <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>{'>'}</button>
      </footer>
    </>
  );
};

export default ArticleList; 