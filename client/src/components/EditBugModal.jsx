import { useState } from "react";
import api from "../api/axios";
import { showToast } from "../utils/toast";

export default function EditBugModal({ bug, onClose, onUpdated }) {
  const [data, setData] = useState({
    title: bug?.title || "",
    description: bug?.description || "",
    severity: bug?.severity || "Low",
    status: bug?.status || "Open"
  });

  const updateBug = async () => {
    try {
      await api.put(`/bugs/${bug.id}`, data);
      showToast("Bug updated");
      onUpdated();
      onClose();
    } catch {
      showToast("Update failed", "error");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Edit Bug</h2>

        <input
          placeholder="Title"
          value={data.title}
          onChange={(e) => setData({ ...data, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          value={data.description}
          onChange={(e) => setData({ ...data, description: e.target.value })}
        />

        <select
          value={data.status}
          onChange={(e) => setData({ ...data, status: e.target.value })}
        >
          <option>Open</option>
          <option>In Progress</option>
          <option>Resolved</option>
        </select>

        <select
          value={data.severity}
          onChange={(e) => setData({ ...data, severity: e.target.value })}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <div className="modal-actions">
          <button className="btn" onClick={updateBug}>
            Save
          </button>

          <button className="btn cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}