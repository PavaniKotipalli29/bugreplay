import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

export default function PublicBug() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get(`/bugs/${id}/public`)
      .then((res) => setData(res.data))
      .catch(() => setData(null));
  }, [id]);

  if (!data) {
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  }

  const { bug, steps, screenshots } = data;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>{bug.title}</h1>

      <div style={styles.badges}>
        <span
          style={{
            ...styles.badge,
            background: getStatusColor(bug.status),
          }}
        >
          {bug.status}
        </span>

        <span style={styles.badge}>{bug.severity}</span>
      </div>

      <p style={styles.desc}>{bug.description}</p>

      <hr />

      <h3>Expected Result</h3>
      <p>{bug.expected_result || "Not provided"}</p>

      <h3>Actual Result</h3>
      <p>{bug.actual_result || "Not provided"}</p>

      <hr />

      <h3>Steps</h3>

      {steps.length === 0 ? (
        <p>No steps</p>
      ) : (
        <ol>
          {steps.map((s, i) => (
            <li key={s.id || i}>
              {s.content || "No step text"}
            </li>
          ))}
        </ol>
      )}

      <hr />

      <h3>Screenshots</h3>

      {screenshots.length === 0 ? (
        <p>No screenshots</p>
      ) : (
        <div style={styles.imgGrid}>
          {screenshots.map((s) => (
            <img
              key={s.id}
              src={`${import.meta.env.VITE_API_URL}${s.file_path}`}
              alt="screenshot"
              style={styles.img}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const getStatusColor = (status) => {
  switch (status) {
    case "Open":
      return "#ff4d4f";

    case "In Progress":
      return "#faad14";

    case "Resolved":
      return "#52c41a";

    default:
      return "#999";
  }
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    fontFamily: "sans-serif",
    background: "#fff",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },

  title: {
    marginBottom: "10px",
  },

  badges: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },

  badge: {
    padding: "5px 10px",
    borderRadius: "6px",
    color: "#fff",
    fontSize: "12px",
    background: "#555",
  },

  desc: {
    marginBottom: "15px",
    lineHeight: "1.6",
  },

  imgGrid: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },

  img: {
    width: "150px",
    borderRadius: "6px",
  },
};