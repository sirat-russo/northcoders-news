const BASE_URL = "https://sirats-nc-news-project.onrender.com/api";

export async function fetchArticles() {
  const res = await fetch(`${BASE_URL}/articles`);
  if (!res.ok) {
    const { msg } = await res.json().catch(() => ({ msg: "Error fetching articles" }));
    throw new Error(msg || "Error fetching articles");
  }
  const data = await res.json();
  return data.articles;
}
