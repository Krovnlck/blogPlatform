import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "./ArticleForm.css";
import { useCreateArticleMutation, useUpdateArticleMutation } from "../features/articlesApi";

const ArticleForm = ({ article, onArticleUpdate }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    defaultValues: {
      title: article?.title || "",
      description: article?.description || "",
      body: article?.body || "",
      tagList: article?.tagList?.join(" ") || ""
    }
  });

  const [createArticle] = useCreateArticleMutation();
  const [updateArticle] = useUpdateArticleMutation();

  const onSubmit = async (data) => {
    try {
      const articleData = {
        article: {
          ...data,
          tagList: data.tagList.split(" ").filter(tag => tag.trim())
        }
      };

      let result;
      if (article) {
        result = await updateArticle({ slug: article.slug, ...articleData }).unwrap();
        onArticleUpdate(result.article);
      } else {
        result = await createArticle(articleData).unwrap();
        navigate(`/article/${result.article.slug}`);
      }
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
          <input
            className="form-input"
            placeholder="Tags"
            {...register("tagList")}
          />
          {errors.tagList && <div className="error-message">{errors.tagList.message}</div>}
        </div>
        <button type="submit" className="form-button">
          {article ? "Save" : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ArticleForm; 