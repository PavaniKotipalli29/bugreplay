import { useState } from "react";
import api from "../api/axios";

export default function FileUploader({ bugId }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    if (!file) return alert("Select a file first");

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      await api.post(`/upload/${bugId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      alert("Screenshot uploaded successfully!");
      window.location.reload(); // refresh to show image

    } catch (err) {
      console.error("UPLOAD ERROR:", err.response?.data || err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "15px" }}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        className="btn-primary"
        onClick={uploadFile}
        disabled={loading}
      >
        {loading ? "Uploading..." : "Upload Screenshot"}
      </button>
    </div>
  );
}