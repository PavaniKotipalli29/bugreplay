import { useEffect, useState } from "react";
import api from "../api/axios";

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    api
      .get("/bugs/analytics/dashboard")
      .then((res) => setData(res.data))
      .catch(console.error);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div className="container">
      <h1 className="page-title">
        Analytics Dashboard
      </h1>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h2>{data.totalBugs}</h2>
          <p>Total Bugs</p>
        </div>

        <div className="analytics-card">
          <h2>{data.openBugs}</h2>
          <p>Open</p>
        </div>

        <div className="analytics-card">
          <h2>{data.progressBugs}</h2>
          <p>In Progress</p>
        </div>

        <div className="analytics-card">
          <h2>{data.resolvedBugs}</h2>
          <p>Resolved</p>
        </div>

        <div className="analytics-card">
          <h2>{data.highSeverity}</h2>
          <p>High Severity</p>
        </div>

        <div className="analytics-card">
          <h2>{data.mediumSeverity}</h2>
          <p>Medium Severity</p>
        </div>

        <div className="analytics-card">
          <h2>{data.lowSeverity}</h2>
          <p>Low Severity</p>
        </div>
      </div>
    </div>
  );
}