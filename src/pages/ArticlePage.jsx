import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchArticleById } from "../api";

export default function ArticlePage() {
  const { article_id } = useParams();
  const [article, setArticle] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setErr(null);

    fetchArticleById(article_id)
      .then(setArticle)
      .catch((e) => setErr(e.message || "Failed to load article"))
      .finally(() => setIsLoading(false));
  }, [article_id]);

  if (isLoading) return <p role="status">Loading article…</p>;
  if (err) return <p role="alert">Could not load article: {err}</p>;
  if (!article) return <p role="alert">Article not found.</p>;

  const {
    title,
    body,
    author,
    topic,
    votes,
    comment_count,
    created_at,
    article_img_url,
  } = article;

  const date = new Date(created_at).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const imageUrl =
    article_img_url || "https://via.placeholder.com/800x450?text=Article+image";

  const paragraphs = body ? body.split("\n\n") : [];

  return (
    <main className="article-page">
      <article className="article-page__article">
        <header className="article-page__header">
          <h1 className="article-page__title">{title}</h1>
          <p className="article-page__meta">
            <span className="article-page__meta-item">Topic: {topic}</span>
            <span className="article-page__meta-item">By {author}</span>
            <span className="article-page__meta-item">{date}</span>
            <span className="article-page__meta-item">
              {votes} {votes === 1 ? "vote" : "votes"}
            </span>
            <span className="article-page__meta-item">
              {comment_count}{" "}
              {comment_count === 1 ? "comment" : "comments"}
            </span>
          </p>
        </header>

        <div className="article-page__image-wrapper">
          <img
            src={imageUrl}
            alt={`Image representing "${title}"`}
            className="article-page__image"
          />
        </div>

        <div className="article-page__body">
          {paragraphs.length > 0 ? (
            paragraphs.map((para, idx) => <p key={idx}>{para}</p>)
          ) : (
            <p>{body}</p>
          )}
        </div>
      </article>
    </main>
  );
}
