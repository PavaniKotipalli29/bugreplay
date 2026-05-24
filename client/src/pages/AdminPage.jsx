import { useEffect, useState } from "react";
import api from "../api/axios";
import BugCard from "../components/BugCard";
import EditBugModal from "../components/EditBugModal";

export default function AdminPage() {
  const [bugs, setBugs] = useState([]);
  const [selectedBug, setSelectedBug] = useState(null);

  const fetchBugs = async () => {
    try {
      const res = await api.get("/bugs");
      setBugs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  return (
    <div className="container">
      <h1>All Bugs</h1>

      {bugs.map((bug) => (
        <BugCard
          key={bug.id}
          bug={bug}
          onEdit={setSelectedBug}
        />
      ))}

      {/* ✅ MODAL */}
      {selectedBug && (
        <EditBugModal
          bug={selectedBug}
          onClose={() => setSelectedBug(null)}
          onUpdated={fetchBugs}
        />
      )}
    </div>
  );
}