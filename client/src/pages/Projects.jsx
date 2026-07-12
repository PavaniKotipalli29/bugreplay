import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Project name is required");

    try {
      await api.post("/projects", { name, description });
      alert("Project created successfully!");
      setName("");
      setDescription("");
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  };

  return (
    <div className="container">
      <div className="project-layout">
        {/* Left Side: Create Project Form */}
        <div className="card project-form-card">
          <h2>Create New Project</h2>
          <form onSubmit={handleCreate}>
            <input
              placeholder="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <textarea
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            />
            <button type="submit" className="btn-primary" style={{ width: "100%" }}>
              Create Project
            </button>
          </form>
        </div>

        {/* Right Side: Projects List */}
        <div className="projects-list-section">
          <h2>Projects Workspace</h2>
          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <p>No projects configured. Create one to get started!</p>
          ) : (
            <div className="projects-grid">
              {projects.map((proj) => (
                <div key={proj.id} className="bug-card project-card">
                  <h3>📂 {proj.name}</h3>
                  <p className="bug-description">
                    {proj.description || "No description provided."}
                  </p>
                  <div className="project-footer">
                    <span className="project-date">
                      Created: {new Date(proj.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
