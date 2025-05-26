import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArticleForm from "../components/ArticleForm";

const API_URL = "https://blog-platform.kata.academy/api";

const NewArticlePage = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setError(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/articles`, {
        method: "POST",
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
        setError(result.errors ? JSON.stringify(result.errors) : "Ошибка создания статьи");
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

  return <ArticleForm onSubmit={handleSubmit} loading={loading} error={error} />;
};

export default NewArticlePage; 