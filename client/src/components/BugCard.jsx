import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { showToast } from "../utils/toast";

export default function BugCard({
  bug,
  onDeleted
}) {
  const nav = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const isAdmin =
    user?.role === "admin";

  const isOwner =
    user?.id === bug.user_id;

  const canModify =
    isAdmin || isOwner;

  const deleteBug = async () => {
    const confirmDelete = window.confirm(
      "Delete this bug?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/bugs/${bug.id}`);

      showToast("Bug deleted");

      if (onDeleted) {
        onDeleted();
      }

    } catch (err) {
      console.log(err);
      showToast("Delete failed", "error");
    }
  };

  const getStatusClass = () => {
    switch (bug.status) {
      case "Open":
        return "badge status-open";

      case "In Progress":
        return "badge status-progress";

      case "Resolved":
        return "badge status-resolved";

      default:
        return "badge";
    }
  };

  const getSeverityClass = () => {
    switch (bug.severity) {
      case "Low":
        return "badge severity-low";

      case "Medium":
        return "badge severity-medium";

      case "High":
        return "badge severity-high";

      default:
        return "badge";
    }
  };

  return (
    <div className="bug-card">

      <h3>{bug.title}</h3>

      <p className="bug-description">
        {bug.description}
      </p>

      {/* ASSIGNED USER */}
      {bug.assigned_to_name ? (
        <p className="assigned-user">
          Assigned To: {bug.assigned_to_name}
        </p>
      ) : (
        <p className="unassigned">
          Unassigned
        </p>
      )}

      {/* BADGES */}
      <div className="badges">

        <span className={getStatusClass()}>
          {bug.status}
        </span>

        <span className={getSeverityClass()}>
          {bug.severity}
        </span>

      </div>

      {/* ACTION BUTTONS */}
      <div className="actions">

        <button
          className="btn-secondary"
          onClick={() =>
            nav(`/bug/${bug.id}`)
          }
        >
          View
        </button>

        {canModify && (
          <>
            <button
              className="btn-primary"
              onClick={() =>
                nav(`/edit-bug/${bug.id}`)
              }
            >
              Edit
            </button>

            <button
              className="btn-danger"
              onClick={deleteBug}
            >
              Delete
            </button>
          </>
        )}

      </div>
    </div>
  );
}