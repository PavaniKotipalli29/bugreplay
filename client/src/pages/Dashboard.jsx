import { useEffect, useState } from "react";

import api from "../api/axios";
import BugCard from "../components/BugCard";

export default function Dashboard() {
  const [bugs, setBugs] = useState([]);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [severity, setSeverity] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBugs = async () => {
    try {
      const res = await api.get("/bugs", {
        params: {
          search,
          status,
          severity,
          page,
          limit: 5
        }
      });

      setBugs(res.data.bugs);
      setTotalPages(res.data.totalPages);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, [page]);

  return (
    <div className="container">
      <h2>Dashboard</h2>

      <input
        placeholder="Search..."
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <select
        onChange={(e) =>
          setStatus(e.target.value)
        }
      >
        <option value="">
          All Status
        </option>

        <option>Open</option>
        <option>In Progress</option>
        <option>Resolved</option>
      </select>

      <select
        onChange={(e) =>
          setSeverity(e.target.value)
        }
      >
        <option value="">
          All Severity
        </option>

        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <button
        className="btn"
        onClick={fetchBugs}
      >
        Filter
      </button>

      {bugs.length === 0 ? (
        <p>No bugs found</p>
      ) : (
        bugs.map((bug) => (
          <BugCard
            key={bug.id}
            bug={bug}
            onDeleted={fetchBugs}
          />
        ))
      )}

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          gap: "10px",
          alignItems: "center"
        }}
      >
        <button
          className="btn"
          disabled={page === 1}
          onClick={() =>
            setPage(page - 1)
          }
        >
          Prev
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          className="btn"
          disabled={page === totalPages}
          onClick={() =>
            setPage(page + 1)
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}