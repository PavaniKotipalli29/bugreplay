import { useState } from "react";
import api from "../api/axios";

export default function StepList({ steps = [], bugId }) {
  const [newStep, setNewStep] = useState("");
  const [loading, setLoading] = useState(false);

  const addStep = async () => {
    if (!newStep.trim()) return alert("Step cannot be empty");

    try {
      setLoading(true);

      // ✅ FIXED API ROUTE
      await api.post(`/steps/${bugId}`, {
        content: newStep.trim()
      });

      setNewStep("");

      // 🔄 reload steps
      window.location.reload();

    } catch (err) {
      console.error("Step error:", err);
      alert("Failed to add step");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Steps</h3>

      {/* Existing steps */}
      {steps.length === 0 ? (
        <p>No steps yet</p>
      ) : (
        steps.map((s) => (
          <div key={s.id} className="step-item">
            <strong>Step {s.step_number}:</strong> {s.content}
          </div>
        ))
      )}

      {/* Add new step */}
      <div style={{ marginTop: "15px" }}>
        <input
          placeholder="Enter step..."
          value={newStep}
          onChange={(e) => setNewStep(e.target.value)}
        />

        <button
          className="btn-primary"
          onClick={addStep}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Step"}
        </button>
      </div>
    </div>
  );
}