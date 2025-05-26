import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./ArticlePage.css";
import { useGetArticleQuery, useDeleteArticleMutation, useFavoriteArticleMutation } from "../features/articlesApi";

const ArticlePage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { data: article, error: loadError, isLoading } = useGetArticleQuery(slug);
  const [deleteArticle] = useDeleteArticleMutation();
  const [favoriteArticle] = useFavoriteArticleMutation();

  if (isLoading) {
    return <div className="loading">Loading article...</div>;
  }

  if (loadError) {
    return <div className="error-message">Error loading article: {loadError.message}</div>;
  }

  if (!article) {
    return <div className="error-message">Article not found</div>;
  }

  const handleDelete = async () => {
    try {
      await deleteArticle(slug).unwrap();
      navigate("/");
    } catch (err) {
      alert("Error deleting article: " + err.message);
    }
  };

  const handleFavorite = async () => {
    try {
      if (!article.favorited) {
        await favoriteArticle(slug).unwrap();
      }
    } catch (err) {
      alert("Error updating favorite status: " + err.message);
    }
  };

  return (
    <article className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>
          <div className="article-meta">
            <a href={`/profile/${article.author.username}`}>
              <img src={article.author.image} alt={article.author.username} />
            </a>
            <div className="info">
              <a href={`/profile/${article.author.username}`} className="author">
                {article.author.username}
              </a>
              <span className="date">{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
            {user && (
              <>
                <button
                  className={`btn btn-sm ${article.favorited ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={handleFavorite}
                  disabled={article.favorited}
                  title={article.favorited ? "Уже лайкнуто" : "Поставить лайк"}
                >
                  <i className="ion-heart"></i>
                  &nbsp; Favorite Article
                  <span className="counter">({article.favoritesCount})</span>
                </button>
                {user.username === article.author.username && (
                  <>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => navigate(`/editor/${article.slug}`)}
                    >
                      <i className="ion-edit"></i> Edit Article
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={handleDelete}
                    >
                      <i className="ion-trash-a"></i> Delete Article
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>{article.body}</p>
            <ul className="tag-list">
              {article.tagList.map((tag) => (
                <li key={tag} className="tag-default tag-pill tag-outline">
                  {tag}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <hr />
        <div className="article-actions">
          <div className="article-meta">
            <a href={`/profile/${article.author.username}`}>
              <img src={article.author.image} alt={article.author.username} />
            </a>
            <div className="info">
              <a href={`/profile/${article.author.username}`} className="author">
                {article.author.username}
              </a>
              <span className="date">{new Date(article.createdAt).toLocaleDateString()}</span>
            </div>
            {user && (
              <>
                <button
                  className={`btn btn-sm ${article.favorited ? "btn-primary" : "btn-outline-primary"}`}
                  onClick={handleFavorite}
                  disabled={article.favorited}
                  title={article.favorited ? "Уже лайкнуто" : "Поставить лайк"}
                >
                  <i className="ion-heart"></i>
                  &nbsp; Favorite Article
                  <span className="counter">({article.favoritesCount})</span>
                </button>
                {user.username === article.author.username && (
                  <>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => navigate(`/editor/${article.slug}`)}
                    >
                      <i className="ion-edit"></i> Edit Article
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={handleDelete}
                    >
                      <i className="ion-trash-a"></i> Delete Article
                    </button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticlePage; 