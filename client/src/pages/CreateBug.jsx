import { useState, useEffect } from "react";
import api from "../api/axios";

export default function CreateBug() {
  const [data, setData] = useState({
    title: "",
    description: "",
    expected_result: "",
    actual_result: "",
    severity: "Low",
    status: "Open",
    project_id: "",
    tags: ""
  });

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await api.get("/projects");
        setProjects(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProjects();
  }, []);

  const submit = async () => {
    // VALIDATION
    if (
      !data.title.trim() ||
      !data.description.trim() ||
      !data.expected_result.trim() ||
      !data.actual_result.trim()
    ) {
      return alert("Please fill all bug details");
    }

    try {
      await api.post("/bugs", {
        ...data,
        project_id: data.project_id || null
      });

      alert("Bug created!");
      window.location.href = "/";
    } catch {
      alert("Failed - Are you logged in?");
    }
  };

  // Get active tags array for display
  const activeTags = data.tags
    ? data.tags.split(",").map(t => t.trim()).filter(Boolean)
    : [];

  return (
    <div className="card" style={{ maxWidth: "600px" }}>
      <h2>Create Bug</h2>

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
      >
        <option value="">Select Project (Optional)</option>
        {projects.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>

      <textarea
        placeholder="Description (Supports Markdown)"
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
          placeholder="Tags (comma-separated, e.g. ui, backend, auth)"
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

      <button className="btn-primary" onClick={submit} style={{ width: "100%" }}>
        Submit Bug
      </button>
    </div>
  );
}