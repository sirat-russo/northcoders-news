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

export async function updateArticleVotes(articleId, incVotes) {
    const res = await fetch(`${BASE_URL}/articles/${articleId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inc_votes: incVotes }),
    });
  
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const msg = errBody.msg || "Error updating article votes";
      throw new Error(msg);
    }
  
    const data = await res.json();
    return data.article;
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

export async function postCommentByArticleId(articleId, username, body) {
  const res = await fetch(`${BASE_URL}/articles/${articleId}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, body }),
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const message = errBody.msg || "Error posting comment";
    throw new Error(message);
  }

  const data = await res.json();
  return data.comment;
}

export async function deleteCommentById(commentId) {
  const res = await fetch(`${BASE_URL}/comments/${commentId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    const message = errBody.msg || "Error deleting comment";
    throw new Error(message);
  }

  return;
}
