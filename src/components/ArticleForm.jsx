import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./ArticleForm.css";
import { useCreateArticleMutation, useUpdateArticleMutation } from "../features/articlesApi";

const ArticleForm = ({ article, onArticleUpdate }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setError, reset } = useForm({
    defaultValues: {
      title: article?.title || "",
      description: article?.description || "",
      body: article?.body || ""
    }
  });

  // Теги как массив
  const [tags, setTags] = useState(article?.tagList?.length ? article.tagList : [""]);

  const [createArticle] = useCreateArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();

  const handleTagChange = (i, value) => {
    const newTags = [...tags];
    newTags[i] = value;
    setTags(newTags);
  };

  const handleAddTag = () => setTags([...tags, ""]);

  const handleDeleteTag = (i) => setTags(tags.filter((_, idx) => idx !== i));

  const onSubmit = async (data) => {
    try {
      const tagList = tags.map(t => t.trim()).filter(Boolean);
      const articleData = {
        article: {
          ...data,
          tagList
        }
      };
      let result;
      if (article) {
        result = await updateArticle({ slug: article.slug, ...articleData }).unwrap();
        if (onArticleUpdate) onArticleUpdate(result.article);
      } else {
        result = await createArticle(articleData).unwrap();
        navigate(`/article/${result.article.slug}`);
      }
      reset();
      setTags([""]);
    } catch (err) {
      if (err.data?.errors) {
        Object.entries(err.data.errors).forEach(([field, messages]) => {
          setError(field, { type: "server", message: messages.join(", ") });
        });
      } else {
        alert("Ошибка при сохранении статьи");
      }
    }
  };

  return (
    <div className="article-form">
      <h2>{article ? "Edit article" : "Create new article"}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label className="form-label">Title</label>
          <input
            className="form-input"
            placeholder="Title"
            {...register("title", { required: "Required" })}
          />
          {errors.title && <div className="error-message">{errors.title.message}</div>}
        </div>
        <div>
          <label className="form-label">Short description</label>
          <input
            className="form-input"
            placeholder="Short description"
            {...register("description", { required: "Required" })}
          />
          {errors.description && <div className="error-message">{errors.description.message}</div>}
        </div>
        <div>
          <label className="form-label">Text</label>
          <textarea
            className="form-textarea"
            placeholder="Text"
            {...register("body", { required: "Required" })}
          />
          {errors.body && <div className="error-message">{errors.body.message}</div>}
        </div>
        <div>
          <label className="form-label">Tags</label>
          {tags.map((tag, i) => (
            <div className="tag-container" key={i}>
              <input
                className="form-input tag-input"
                value={tag}
                placeholder="Tag"
                onChange={e => handleTagChange(i, e.target.value)}
              />
              <button
                type="button"
                className="tag-delete-button"
                onClick={() => handleDeleteTag(i)}
                disabled={tags.length === 1}
              >
                Delete
              </button>
            </div>
          ))}
          <button type="button" className="tag-button" onClick={handleAddTag}>
            Add tag
          </button>
        </div>
        <button type="submit" className="form-button">
          {article ? "Save" : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ArticleForm; 