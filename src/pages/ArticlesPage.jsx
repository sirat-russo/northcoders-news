import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchArticles } from "../api";
import ArticleCard from "../components/ArticleCard";

export default function ArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState(null);

  const sortBy = searchParams.get("sort_by") || "created_at";
  const order = searchParams.get("order") || "desc";

  useEffect(() => {
    setIsLoading(true);
    setErr(null);

    fetchArticles(undefined, sortBy, order)
      .then(setArticles)
      .catch((e) =>
        setErr(e.message || "Failed to load articles")
      )
      .finally(() => setIsLoading(false));
  }, [sortBy, order]);

  function handleSortByChange(event) {
    const nextSortBy = event.target.value;

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("sort_by", nextSortBy);
      params.set("order", order);
      return params;
    });
  }

  function handleOrderChange(event) {
    const nextOrder = event.target.value;

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      params.set("sort_by", sortBy);
      params.set("order", nextOrder);
      return params;
    });
  }


  if (isLoading) return <p role="status">Loading articles…</p>;
  if (err) return <p role="alert">Could not load articles: {err}</p>;

  return (
    <main>
      <h1 className="page-title">Articles</h1>

      <form
        className="articles-sort"
        aria-label="Sort articles"
        onSubmit={(e) => e.preventDefault()}
      >
        <label>
          Sort by{" "}
          <select value={sortBy} onChange={handleSortByChange}>
            <option value="created_at">Date</option>
            <option value="comment_count">Comment count</option>
            <option value="votes">Votes</option>
          </select>
        </label>

        <label>
          Order{" "}
          <select value={order} onChange={handleOrderChange}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </label>
      </form>

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
