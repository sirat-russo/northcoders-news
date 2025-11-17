import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchTopics, fetchArticles } from "../api";
import ArticleCard from "../components/ArticleCard";

export default function TopicsPage() {
  const { topic_slug } = useParams();

  const [topics, setTopics] = useState([]);
  const [areTopicsLoading, setAreTopicsLoading] = useState(true);
  const [topicsError, setTopicsError] = useState(null);

  const [articles, setArticles] = useState([]);
  const [areArticlesLoading, setAreArticlesLoading] = useState(false);
  const [articlesError, setArticlesError] = useState(null);

  useEffect(() => {
    setAreTopicsLoading(true);
    setTopicsError(null);

    fetchTopics()
      .then(setTopics)
      .catch((err) =>
        setTopicsError(err.message || "Failed to load topics")
      )
      .finally(() => setAreTopicsLoading(false));
  }, []);

  useEffect(() => {
    if (!topic_slug) {
      setArticles([]);
      setArticlesError(null);
      setAreArticlesLoading(false);
      return;
    }

    setAreArticlesLoading(true);
    setArticlesError(null);

    fetchArticles(topic_slug)
      .then(setArticles)
      .catch((err) =>
        setArticlesError(
          err.message || "Failed to load articles for this topic"
        )
      )
      .finally(() => setAreArticlesLoading(false));
  }, [topic_slug]);

  const pageTitle = topic_slug
    ? `Topic: ${topic_slug}`
    : "Topics";

  return (
    <main>
      <h1 className="page-title">{pageTitle}</h1>

      {}
      {areTopicsLoading && (
        <p role="status">Loading topics…</p>
      )}

      {topicsError && (
        <p role="alert">Could not load topics: {topicsError}</p>
      )}

      {!areTopicsLoading && !topicsError && (
        <nav
          className="topics-nav"
          aria-label="Available topics"
        >
          <ul className="topics-list">
            {topics.map((topic) => (
              <li key={topic.slug}>
                <Link
                  to={`/topics/${topic.slug}`}
                  className={
                    topic_slug === topic.slug
                      ? "topics-link topics-link--active"
                      : "topics-link"
                  }
                >
                  {topic.slug}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {}
      {!topic_slug && !areTopicsLoading && !topicsError && (
        <p>Select a topic above to view related articles.</p>
      )}

      {}
      {topic_slug && (
        <>
          {areArticlesLoading && (
            <p role="status">Loading articles for this topic…</p>
          )}

          {articlesError && (
            <p role="alert">
              Could not load articles for this topic: {articlesError}
            </p>
          )}

          {!areArticlesLoading &&
            !articlesError &&
            articles.length === 0 && (
              <p>No articles found for this topic.</p>
            )}

          {!areArticlesLoading &&
            !articlesError &&
            articles.length > 0 && (
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
            )}
        </>
      )}
    </main>
  );
}
