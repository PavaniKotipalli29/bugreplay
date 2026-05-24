import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import api from "../api/axios";
import { showToast } from "../utils/toast";

export default function EditBug() {
  const { id } = useParams();

  const nav = useNavigate();

  const [data, setData] = useState({
    title: "",
    description: "",
    status: "Open",
    severity: "Low",
    expected_result: "",
    actual_result: ""
  });

  useEffect(() => {
    fetchBug();
  }, []);

  const fetchBug = async () => {
    try {
      const res = await api.get(`/bugs/${id}`);

      setData({
        title:
          res.data.bug.title || "",

        description:
          res.data.bug.description || "",

        status:
          res.data.bug.status || "Open",

        severity:
          res.data.bug.severity || "Low",

        expected_result:
          res.data.bug.expected_result || "",

        actual_result:
          res.data.bug.actual_result || ""
      });

    } catch (err) {
      console.log(err);
      showToast("Failed to load bug", "error");
    }
  };

  const updateBug = async () => {
    try {
      await api.put(`/bugs/${id}`, data);

      showToast("Bug updated");

      nav(`/bug/${id}`);

    } catch (err) {
      console.log(err);
      showToast("Update failed", "error");
    }
  };

  return (
    <div className="container">
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
        >
          Save Changes
        </button>

        <button
          className="btn-secondary"
          onClick={() => nav(-1)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}