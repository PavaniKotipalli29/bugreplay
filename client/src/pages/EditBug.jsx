import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";

export default function EditBug() {
  const { id } = useParams();
  const nav = useNavigate();

  const [data, setData] = useState({
    title: "",
    description: "",
    status: "Open",
    severity: "Low",
    expected_result: "",
    actual_result: "",
    project_id: "",
    tags: ""
  });

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
    fetchBug();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBug = async () => {
    try {
      const res = await api.get(`/bugs/${id}`);
      const b = res.data.bug;
      setData({
        title: b.title || "",
        description: b.description || "",
        status: b.status || "Open",
        severity: b.severity || "Low",
        expected_result: b.expected_result || "",
        actual_result: b.actual_result || "",
        project_id: b.project_id || "",
        tags: b.tags || ""
      });
    } catch (err) {
      console.error(err);
      alert("Failed to load bug details");
    }
  };

  const updateBug = async () => {
    try {
      await api.put(`/bugs/${id}`, {
        ...data,
        project_id: data.project_id || null
      });
      alert("Bug updated successfully");
      nav(`/bug/${id}`);
    } catch (err) {
      console.error(err);
      alert("Update failed - Unauthorized or Server Error");
    }
  };

  const activeTags = data.tags
    ? data.tags.split(",").map(t => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="container" style={{ maxWidth: "600px" }}>
      <h2>Edit Bug</h2>

      <input
        placeholder="Title"
        value={data.title}
        onChange={(e) =>
          setData({
            ...data,
            title: e.target.value
          })
        }
      />

      <select
        value={data.project_id}
        onChange={(e) =>
          setData({
            ...data,
            project_id: e.target.value
          })
        }
        style={{ marginBottom: "14px" }}
      >
        <option value="">Select Project (Optional)</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Description"
        value={data.description}
        onChange={(e) =>
          setData({
            ...data,
            description: e.target.value
          })
        }
      />

      <textarea
        placeholder="Expected Result"
        value={data.expected_result}
        onChange={(e) =>
          setData({
            ...data,
            expected_result: e.target.value
          })
        }
      />

      <textarea
        placeholder="Actual Result"
        value={data.actual_result}
        onChange={(e) =>
          setData({
            ...data,
            actual_result: e.target.value
          })
        }
      />

      <select
        value={data.status}
        onChange={(e) =>
          setData({
            ...data,
            status: e.target.value
          })
        }
      >
        <option>Open</option>
        <option>In Progress</option>
        <option>Resolved</option>
      </select>

      <select
        value={data.severity}
        onChange={(e) =>
          setData({
            ...data,
            severity: e.target.value
          })
        }
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <div style={{ marginBottom: "14px" }}>
        <input
          placeholder="Tags (comma-separated, e.g. ui, backend)"
          value={data.tags}
          onChange={(e) =>
            setData({
              ...data,
              tags: e.target.value
            })
          }
          style={{ marginBottom: "6px" }}
        />
        {activeTags.length > 0 && (
          <div className="badges" style={{ margin: "4px 0" }}>
            {activeTags.map((t, idx) => (
              <span key={idx} className="badge severity-low">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px"
        }}
      >
        <button
          className="btn-primary"
          onClick={updateBug}
          style={{ flex: 1 }}
        >
          Save Changes
        </button>

        <button
          className="btn-secondary"
          onClick={() => nav(-1)}
          style={{ flex: 1 }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}