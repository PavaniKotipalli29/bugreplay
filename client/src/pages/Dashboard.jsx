import { useEffect, useState } from "react";
import api from "../api/axios";
import BugCard from "../components/BugCard";

export default function Dashboard() {
  const [bugs, setBugs] = useState([]);
  const [projects, setProjects] = useState([]);

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [severity, setSeverity] = useState("");
  const [projectId, setProjectId] = useState("");
  const [tag, setTag] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch projects list
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

  const fetchBugs = async () => {
    try {
      const res = await api.get("/bugs", {
        params: {
          search,
          status,
          severity,
          project_id: projectId || undefined,
          tag: tag || undefined,
          sortBy,
          page,
          limit: 5
        }
      });

      setBugs(res.data.bugs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, [page, sortBy]); // refetch on page change or sort change

  const handleFilter = (e) => {
    e.preventDefault();
    setPage(1); // Reset to page 1 on new filter
    fetchBugs();
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>

      {/* FILTER BAR PANEL */}
      <form onSubmit={handleFilter} className="bug-card filter-panel" style={{ padding: "18px", marginBottom: "20px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px" }}>
        <input
          placeholder="Search text..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ marginBottom: 0 }}
        />

        <select
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
          style={{ marginBottom: 0 }}
        >
          <option value="">All Projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ marginBottom: 0 }}
        >
          <option value="">All Status</option>
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>

        <select
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
          style={{ marginBottom: 0 }}
        >
          <option value="">All Severity</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <input
          placeholder="Filter by Tag..."
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          style={{ marginBottom: 0 }}
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ marginBottom: 0 }}
        >
          <option value="newest">Sort by: Newest</option>
          <option value="priority">Sort by: Priority</option>
          <option value="severity">Sort by: Severity</option>
        </select>

        <button type="submit" className="btn-primary" style={{ height: "42px" }}>
          Apply Filters
        </button>
      </form>

      {/* BUGS RENDER GRID */}
      {bugs.length === 0 ? (
        <p>No bugs found matching current filter options</p>
      ) : (
        bugs.map((bug) => (
          <BugCard
            key={bug.id}
            bug={bug}
            onDeleted={fetchBugs}
          />
        ))
      )}

      {/* PAGINATION */}
      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <button
          className="btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          className="btn"
          disabled={page === totalPages || totalPages === 0}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}