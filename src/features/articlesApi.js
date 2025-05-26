const API_URL = 'https://blog-platform.kata.academy/api';

export async function fetchArticles({ limit = 5, offset = 0 } = {}) {
  const res = await fetch(`${API_URL}/articles?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Ошибка загрузки статей');
  return res.json();
}

export async function fetchArticle(slug) {
  const res = await fetch(`${API_URL}/articles/${slug}`);
  if (!res.ok) throw new Error('Ошибка загрузки статьи');
  return res.json();
}

export async function likeArticle(slug, token) {
  const res = await fetch(`${API_URL}/articles/${slug}/favorite`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (!res.ok) throw new Error('Ошибка лайка');
  return res.json();
}

export async function unlikeArticle(slug, token) {
  const res = await fetch(`${API_URL}/articles/${slug}/favorite`, {
    method: 'DELETE',
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  if (!res.ok) throw new Error('Ошибка дизлайка');
  return res.json();
} 