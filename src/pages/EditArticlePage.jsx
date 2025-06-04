import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ArticleForm from "../components/ArticleForm";

const API_URL = "https://blog-platform.kata.academy/api";

const EditArticlePage = () => {
  const { slug } = useParams();
  const [initialValues, setInitialValues] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/articles/${slug}`);
        const result = await res.json();
        if (!res.ok) throw new Error("Ошибка загрузки статьи");
        setInitialValues({
          title: result.article.title,
          description: result.article.description,
          body: result.article.body,
          tagList: result.article.tagList.length ? result.article.tagList : ['']
        });
      } catch {
        setError("Ошибка загрузки статьи");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const handleSubmit = async (data) => {
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/articles/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify({
          article: {
            title: data.title,
            description: data.description,
            body: data.body,
            tagList: Array.isArray(data.tagList) ? data.tagList.map(t => t.value) : []
          }
        })
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.errors ? JSON.stringify(result.errors) : "Ошибка обновления статьи");
        setLoading(false);
        return;
      }
      navigate(`/articles/${result.article.slug}`);
    } catch {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
    }
  };

  if (loading || !initialValues) return <div>Загрузка...</div>;
  if (error) return <div style={{color: 'red'}}>{error}</div>;

  return <ArticleForm article={initialValues} onSubmit={handleSubmit} isEdit loading={loading} error={error} />;
};

export default EditArticlePage; 