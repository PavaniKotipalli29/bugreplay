import { useEffect, useState } from "react";
import api from "../api/axios";

export default function CommentSection({ bugId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔄 Fetch comments
  const fetchComments = async () => {
    try {
      const res = await api.get(`/comments/${bugId}`);
      setComments(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    if (bugId) fetchComments();
  }, [bugId]);

  // ➕ Add comment
  const addComment = async () => {
    if (!text.trim()) return alert("Comment cannot be empty");

    try {
      setLoading(true);

      await api.post(`/comments/${bugId}`, {
        comment: text.trim()
      });

      setText("");
      fetchComments(); // refresh instantly
    } catch (err) {
      console.error("Add error:", err);
      alert("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  // ⌨️ Submit on Enter (optional UX)
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addComment();
    }
  };

  return (
    <div className="comment-box">
      <h3>Comments</h3>

      {/* 📄 Comment List */}
      {comments.length === 0 ? (
        <p>No comments yet</p>
      ) : (
        comments.map((c) => (
          <div key={c.id} className="comment-item">
            <div className="comment-header">
              <span className="comment-user">
                {c.name || "Unknown User"}
              </span>

              <span className="comment-time">
                {c.created_at
                  ? new Date(c.created_at).toLocaleString()
                  : ""}
              </span>
            </div>

            <p className="comment-text">{c.comment}</p>
          </div>
        ))
      )}

      {/* ✍️ Add Comment */}
      <textarea
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button
        className="btn-primary"
        onClick={addComment}
        disabled={loading}
      >
        {loading ? "Posting..." : "Add Comment"}
      </button>
    </div>
  );
}