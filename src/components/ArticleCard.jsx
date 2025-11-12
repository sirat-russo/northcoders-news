import { Link } from "react-router-dom";

export default function ArticleCard({
  articleId,
  title,
  author,
  topic,
  votes,
  commentCount,
  createdAt,
  imageUrl,
}) {
  const date = new Date(createdAt).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const safeImg =
    imageUrl || "https://via.placeholder.com/640x360?text=Article+image";

  return (
    <article className="article-card" role="article" aria-label={title}>
      <Link
        to={`/articles/${articleId}`}
        className="article-card__link"
        aria-label={`View article: ${title}`}
      >
        <div className="article-card__image-wrapper">
          <img
            src={safeImg}
            alt={`Image representing "${title}"`}
            className="article-card__image"
            loading="lazy"
          />
        </div>

        <div className="article-card__body">
          <h2 className="article-card__title">{title}</h2>

          <dl className="article-card__meta">
            <div>
              <dt>Author</dt>
              <dd>{author}</dd>
            </div>
            <div>
              <dt>Topic</dt>
              <dd>{topic}</dd>
            </div>
            <div>
              <dt>Published</dt>
              <dd>{date}</dd>
            </div>
            <div>
              <dt>Votes</dt>
              <dd>{votes}</dd>
            </div>
            <div>
              <dt>Comments</dt>
              <dd>{commentCount}</dd>
            </div>
          </dl>
        </div>
      </Link>
    </article>
  );
}
