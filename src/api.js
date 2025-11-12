const BASE_URL = "https://sirats-nc-news-project.onrender.com/api";

export async function fetchArticles() {
  const res = await fetch(`${BASE_URL}/articles`);
  if (!res.ok) {
    const msg = await res.json().catch(() => ({ msg: "Error fetching articles" }));
    throw new Error(msg.msg || "Error fetching articles");
  }
  const data = await res.json();
  return data.articles;
}

export async function fetchArticleById(articleId) {
  const res = await fetch(`${BASE_URL}/articles/${articleId}`);

  if (!res.ok) {
    const msg = await res.json().catch(() => ({ msg: "Error fetching article" }));
    throw new Error(msg.msg || "Error fetching article");
  }

  const data = await res.json();
  return data.article;
}
