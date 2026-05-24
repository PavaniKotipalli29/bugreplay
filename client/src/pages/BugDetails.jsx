import {
  useEffect,
  useState
} from "react";

import {
  useParams,
  Link
} from "react-router-dom";

import api from "../api/axios";

import StepList from "../components/StepList";
import CommentSection from "../components/CommentSection";
import FileUploader from "../components/FileUploader";
import ActivityTimeline from "../components/ActivityTimeline";

export default function BugDetails() {

  const { id } = useParams();

  const [data, setData] =
    useState(null);

  const [users, setUsers] =
    useState([]);

  const [selectedImg, setSelectedImg] =
    useState(null);

  const currentUser =
    JSON.parse(
      localStorage.getItem("user")
    );

  /*
  ========================================
  FETCH BUG
  ========================================
  */

  const fetchBug = () => {

    api.get(`/bugs/${id}`)
      .then((res) =>
        setData(res.data)
      )
      .catch((err) =>
        console.log(err)
      );

  };

  useEffect(() => {

    fetchBug();

    if (currentUser) {

      api.get("/bugs/users/all")
        .then((res) =>
          setUsers(res.data)
        )
        .catch((err) =>
          console.log(err)
        );

    }

  }, [id]);

  if (!data)
    return <p>Loading...</p>;

  const bug = data.bug;

  const canModify =
    currentUser?.role === "admin"
    ||
    currentUser?.id === bug.user_id;

  /*
  ========================================
  SHARE BUG
  ========================================
  */

  const shareBug = () => {

    const link =
      `${window.location.origin}/share/bug/${id}`;

    navigator.clipboard.writeText(link);

    alert("Share link copied!");

  };

  /*
  ========================================
  ASSIGN BUG
  ========================================
  */

  const assignBug = async (
    userId
  ) => {

    try {

      await api.patch(
        `/bugs/${id}/assign`,
        {
          assigned_to: userId
        }
      );

      alert(
        "Bug assigned successfully"
      );

      fetchBug();

    } catch (err) {

      console.log(err);

      alert(
        "Assignment failed"
      );

    }

  };

  /*
  ========================================
  UPDATE STATUS
  ========================================
  */

  const updateStatus = async (
    status
  ) => {

    try {

      await api.patch(
        `/bugs/${id}/status`,
        { status }
      );

      alert(
        "Status updated"
      );

      fetchBug();

    } catch (err) {

      console.log(err);

      alert(
        "Status update failed"
      );

    }

  };

  /*
  ========================================
  UPDATE PRIORITY
  ========================================
  */

  const updatePriority =
    async (priority) => {

      try {

        await api.patch(
          `/bugs/${id}/priority`,
          { priority }
        );

        alert(
          "Priority updated"
        );

        fetchBug();

      } catch (err) {

        console.log(err);

        alert(
          "Priority update failed"
        );

      }

    };

  return (

    <div className="container">

      <div className="bug-header">

        <h2>
          {bug.title}
        </h2>

        <div className="actions">

          <button
            className="btn-primary"
            onClick={shareBug}
          >
            🔗 Share
          </button>

          {canModify && (

            <Link
              to={`/edit-bug/${id}`}
            >

              <button
                className="btn-secondary"
              >
                ✏ Edit
              </button>

            </Link>

          )}

        </div>

      </div>

      <div className="bug-card">

        <p>
          <strong>
            Created By:
          </strong>{" "}
          {bug.creator_name}
        </p>

        <p>
          <strong>
            Assigned To:
          </strong>{" "}
          {
            bug.assigned_to_name
            ||
            "Unassigned"
          }
        </p>

        <p>
          <strong>
            Description:
          </strong>{" "}
          {bug.description}
        </p>

        {/* BADGES */}

        <div className="badges">

          <span
            className={`badge ${
              bug.status === "Open"
                ? "status-open"
                : bug.status === "In Progress"
                ? "status-progress"
                : "status-resolved"
            }`}
          >
            Status: {bug.status}
          </span>

          <span
            className={`badge ${
              bug.severity === "Low"
                ? "severity-low"
                : bug.severity === "Medium"
                ? "severity-medium"
                : "severity-high"
            }`}
          >
            Severity: {bug.severity}
          </span>

          <span
            className={`badge ${
              bug.priority === "Low"
                ? "severity-low"
                : bug.priority === "Medium"
                ? "severity-medium"
                : "severity-high"
            }`}
          >
            Priority: {bug.priority}
          </span>

        </div>

      </div>

      <hr />

      <h3>
        Expected Result
      </h3>

      <p>
        {
          bug.expected_result
          ||
          "Not provided"
        }
      </p>

      <h3>
        Actual Result
      </h3>

      <p>
        {
          bug.actual_result
          ||
          "Not provided"
        }
      </p>

      <hr />

      {/* ADMIN CONTROLS */}

      {currentUser?.role ===
        "admin" && (

        <div className="bug-card">

          <h3>
            Admin Controls
          </h3>

          <h4>
            Assign Bug
          </h4>

          <select
            value={
              bug.assigned_to || ""
            }
            onChange={(e) =>
              assignBug(
                e.target.value
              )
            }
          >

            <option value="">
              Select User
            </option>

            {users.map((u) => (

              <option
                key={u.id}
                value={u.id}
              >
                {u.name}
              </option>

            ))}

          </select>

          <h4>
            Update Status
          </h4>

          <select
            value={bug.status}
            onChange={(e) =>
              updateStatus(
                e.target.value
              )
            }
          >

            <option>
              Open
            </option>

            <option>
              In Progress
            </option>

            <option>
              Resolved
            </option>

          </select>

          <h4>
            Update Priority
          </h4>

          <select
            value={bug.priority}
            onChange={(e) =>
              updatePriority(
                e.target.value
              )
            }
          >

            <option>
              Low
            </option>

            <option>
              Medium
            </option>

            <option>
              High
            </option>

            <option>
              Critical
            </option>

          </select>

        </div>

      )}

      <hr />

      <StepList
        steps={data.steps}
        bugId={id}
      />

      <hr />

      <h3>
        Screenshots
      </h3>

      <FileUploader
        bugId={id}
      />

      {data.screenshots.length === 0
        ? (
          <p>
            No screenshots
          </p>
        ) : (

          <div className="screenshots">

            {data.screenshots.map(
              (s) => (

                <img
                  key={s.id}
                  src={`http://localhost:5000${s.file_path}`}
                  className="screenshot-img"
                  alt="screenshot"
                  onClick={() =>
                    setSelectedImg(
                      `http://localhost:5000${s.file_path}`
                    )
                  }
                />

              )
            )}

          </div>

        )}

      <hr />

      <CommentSection
        bugId={id}
      />

      <hr />

      <ActivityTimeline
        bugId={id}
      />

      {selectedImg && (

        <div
          className="image-modal"
          onClick={() =>
            setSelectedImg(null)
          }
        >

          <span
            className="close-btn"
            onClick={() =>
              setSelectedImg(null)
            }
          >
            ✖
          </span>

          <img
            src={selectedImg}
            className="modal-img"
            onClick={(e) =>
              e.stopPropagation()
            }
          />

        </div>

      )}

    </div>

  );

}