const BASE_URL = "https://sirats-nc-news-project.onrender.com/api";

export async function fetchArticles() {
  const res = await fetch(`${BASE_URL}/articles`);
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const message = errBody.msg || "Error fetching articles";
    throw new Error(message);
  }
  const data = await res.json();
  return data.articles;
}

export async function fetchArticleById(articleId) {
  const res = await fetch(`${BASE_URL}/articles/${articleId}`);
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const message = errBody.msg || "Error fetching article";
    throw new Error(message);
  }
  const data = await res.json();
  return data.article;
}

export async function fetchCommentsByArticleId(articleId) {
  const res = await fetch(`${BASE_URL}/articles/${articleId}/comments`);
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const message = errBody.msg || "Error fetching comments";
    throw new Error(message);
  }
  const data = await res.json();
  return data.comments;
}
