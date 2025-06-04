import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { useFavoriteArticleMutation } from '../features/articlesApi';

const API_URL = "https://blog-platform.kata.academy/api";

const ArticlePage = ({ user, isAuth }) => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [favoriteArticle] = useFavoriteArticleMutation();
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    let isMounted = true;
    const fetchArticle = async () => {
      if (!slug) {
        setError("Slug не найден");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`${API_URL}/articles/${slug}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("Статья не найдена");
          }
          throw new Error("Ошибка загрузки статьи");
        }
        const result = await res.json();
        if (isMounted) {
          setArticle(result.article);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          if (err.message === "Статья не найдена") {
            navigate("/", { replace: true });
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchArticle();

    return () => {
      isMounted = false;
    };
  }, [slug, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Вы уверены, что хотите удалить статью?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/articles/${slug}`, {
        method: "DELETE",
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      if (!res.ok) throw new Error("Ошибка удаления");
      navigate("/");
    } catch {
      alert("Ошибка удаления статьи");
    }
  };

  const handleLike = async () => {
    if (!isAuth) return;
    try {
      if (!article.favorited) {
        const result = await favoriteArticle(slug).unwrap();
        setArticle(result.article);
      }
    } catch (e) {
      alert(e.message);
    }
  };

  if (loading) return (
    <div className="article-list-wrapper">
      <div className="main-content">
        <div className="spinner"></div>
      </div>
    </div>
  );
  if (error) return <div style={{color: 'red'}}>{error}</div>;
  if (!article) return null;

  const isAuthor = isAuth && user && article.author.username === user.username;

  return (
    <div className="article-list-wrapper">
      <div className="main-content">
        <button className="page-btn" style={{ marginBottom: 20, width: 120 }} onClick={() => navigate(page > 1 ? `/?page=${page}` : "/")}>
          ← Назад
        </button>
        <div className="article-card">
          <div className="article-main">
            <div>
              <a href="#" className="article-title">{article.title}</a>
              <span className="likes">
                <span
                  className="like-icon"
                  style={{ color: article.favorited ? '#ff4d4f' : '#888', cursor: isAuth ? 'pointer' : 'not-allowed' }}
                  onClick={handleLike}
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
              <div style={{marginTop: 24}}>
                <ReactMarkdown>{article.body}</ReactMarkdown>
              </div>
            </div>
            <div className="author-block">
              <div className="author-info">
                <span className="author-name">{article.author.username}</span>
                <span className="date">{new Date(article.createdAt).toLocaleDateString()}</span>
              </div>
              <img className="avatar" src={article.author.image} alt="avatar" />
            </div>
          </div>
          {isAuthor && (
            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button className="page-btn" style={{ background: '#fff', color: '#2196f3', border: '1px solid #2196f3' }} onClick={() => navigate(`/articles/${slug}/edit`)}>Edit</button>
              <button className="page-btn" style={{ background: '#fff', color: '#ff4d4f', border: '1px solid #ff4d4f' }} onClick={handleDelete}>Delete</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlePage; 