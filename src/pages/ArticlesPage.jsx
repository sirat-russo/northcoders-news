import { useEffect, useState } from "react";
import { fetchArticles } from "../api";
import ArticleCard from "../components/ArticleCard";

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setErr(null);

    fetchArticles()
      .then(setArticles)
      .catch((e) => setErr(e.message || "Failed to load articles"))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p role="status">Loading articles…</p>;
  if (err) return <p role="alert">Could not load articles: {err}</p>;

  return (
    <main>
      <h1 className="page-title">Articles</h1>

      <ul className="article-grid" aria-live="polite">
        {articles.map((a) => (
          <li key={a.article_id}>
            <ArticleCard
              articleId={a.article_id}
              title={a.title}
              author={a.author}
              topic={a.topic}
              votes={a.votes}
              createdAt={a.created_at}
              commentCount={a.comment_count}
              imageUrl={a.article_img_url}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
