import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchArticleById,
  fetchCommentsByArticleId,
  updateArticleVotes
} from "../api";

export default function ArticlePage() {
  const { article_id } = useParams();

  const [article, setArticle] = useState(null);
  const [isArticleLoading, setIsArticleLoading] = useState(true);
  const [articleError, setArticleError] = useState(null);

  const [comments, setComments] = useState([]);
  const [areCommentsLoading, setAreCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState(null);

  const [voteDelta, setVoteDelta] = useState(0);
  const [isVoting, setIsVoting] = useState(false);
  const [voteError, setVoteError] = useState(null); 


  useEffect(() => {   
    setIsArticleLoading(true);
    setArticleError(null);

    fetchArticleById(article_id)
      .then(setArticle)
      .catch((err) =>
        setArticleError(err.message || "Failed to load article")
      )
      .finally(() => setIsArticleLoading(false));

    setAreCommentsLoading(true);
    setCommentsError(null);

    fetchCommentsByArticleId(article_id)
      .then(setComments)
      .catch((err) =>
        setCommentsError(err.message || "Failed to load comments")
      )
      .finally(() => setAreCommentsLoading(false));
  }, [article_id]);

  if (isArticleLoading) {
    return <p role="status">Loading article…</p>;
  }

  if (articleError) {
    return <p role="alert">Could not load article: {articleError}</p>;
  }

  const {
    title,
    body,
    topic,
    author,
    votes,
    comment_count,
    created_at,
    article_img_url,
  } = article;

  const displayDate = new Date(created_at).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const heroImg =
    article_img_url ||
    "https://via.placeholder.com/1024x576?text=Article+image";

function handleVote(change) {
    if (!article) return;
    setVoteDelta((curr) => curr + change);
    setIsVoting(true);
    setVoteError(null);
    updateArticleVotes(article.article_id, change)
    .then((updatedArticle) => {
        setArticle(updatedArticle);
        setVoteDelta(0);
    })
    .catch((err) => {
        setVoteDelta((curr) => curr - change);
        setVoteError(err.message || "Something went wrong while voting.");
    })
    .finally(() => {
        setIsVoting(false);
    });
}
      

  return (
    <main className="article-page">
      <article className="article-full">
        <header className="article-full__header">
          <h1 className="article-full__title">{title}</h1>
          <p className="article-full__meta">
            Topic: <span>{topic}</span> • By <span>{author}</span> •{" "}
            <span>{displayDate}</span> • <span>{votes}</span> votes •{" "}
            <span>{comment_count}</span> comments
          </p>
        </header>

        <div className="article-votes">
            <p className="article-votes__count">
                Votes: <span>{article.votes + voteDelta}</span>
                </p>
                <div
                className="article-votes__controls"
                aria-label="Vote on this article"
                >
                    <button
                    type="button"
                    onClick={() => handleVote(1)}
                    disabled={isVoting}
                    >
                        +1
                        </button>
                        <button
                        type="button"
                        onClick={() => handleVote(-1)}
                        disabled={isVoting}
                        >
                            -1
                            </button>
                            </div>
                            {voteError && (
                                <p className="article-votes__error" role="alert">
                                    {voteError}
                                    </p>
                                )}
        </div>


        <div className="article-full__image-wrapper">
          <img
            src={heroImg}
            alt={`Image representing ${title}`}
            className="article-full__image"
            loading="lazy"
          />
        </div>

        <div className="article-full__body">
          <p>{body}</p>
        </div>
      </article>

      {}
      <section className="comments">
        <h2 className="comments__title">
          Comments ({comment_count})
        </h2>

        {areCommentsLoading && (
          <p role="status">Loading comments…</p>
        )}

        {commentsError && (
          <p role="alert">Could not load comments: {commentsError}</p>
        )}

        {!areCommentsLoading &&
          !commentsError &&
          comments.length === 0 && (
            <p>No comments yet. Be the first to comment!</p>
          )}

        {!areCommentsLoading &&
          !commentsError &&
          comments.length > 0 && (
            <ul className="comment-list" aria-live="polite">
              {comments.map((c) => {
                const commentDate = new Date(
                  c.created_at
                ).toLocaleString("en-GB", {
                  year: "numeric",
                  month: "short",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <li
                    key={c.comment_id}
                    className="comment-card"
                  >
                    <header className="comment-card__header">
                      <span className="comment-card__author">
                        {c.author}
                      </span>
                      <span className="comment-card__date">
                        {commentDate}
                      </span>
                    </header>

                    <p className="comment-card__body">
                      {c.body}
                    </p>

                    <p className="comment-card__votes">
                      Votes: <span>{c.votes}</span>
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
      </section>
    </main>
  );
}
