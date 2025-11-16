import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchArticleById,
  fetchCommentsByArticleId,
  updateArticleVotes,
  postCommentByArticleId,
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

  const [newCommentBody, setNewCommentBody] = useState("");
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [postCommentError, setPostCommentError] = useState(null);


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

function handleCommentSubmit(event) {
  event.preventDefault();

  const trimmed = newCommentBody.trim();
  if (!trimmed) {
    setPostCommentError("Comment cannot be empty.");
    return;
  }

  if (!article) return;

  setIsPostingComment(true);
  setPostCommentError(null);

  const username = "tickle122"; 

  postCommentByArticleId(article.article_id, username, trimmed)
    .then((newComment) => {
      setComments((current) => [newComment, ...current]);

      setArticle((currentArticle) =>
        currentArticle
          ? {
              ...currentArticle,
              comment_count: currentArticle.comment_count + 1,
            }
          : currentArticle
      );

      setNewCommentBody("");
    })
    .catch((err) => {
      setPostCommentError(err.message || "Failed to post comment.");
    })
    .finally(() => {
      setIsPostingComment(false);
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

        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <label htmlFor="new-comment">
            Add a comment
          </label>
          <textarea
            id="new-comment"
            name="new-comment"
            value={newCommentBody}
            onChange={(event) => setNewCommentBody(event.target.value)}
            placeholder="Share your thoughts about this article…"
            disabled={isPostingComment}
            required
          />
          <div className="comment-form__actions">
            <button
              type="submit"
              disabled={isPostingComment || !newCommentBody.trim()}
            >
              {isPostingComment ? "Posting…" : "Post comment"}
            </button>
          </div>

          {postCommentError && (
            <p className="comment-form__error" role="alert">
              {postCommentError}
            </p>
          )}

          {isPostingComment && !postCommentError && (
            <p className="comment-form__status" role="status">
              Submitting your comment…
            </p>
          )}
        </form>

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
