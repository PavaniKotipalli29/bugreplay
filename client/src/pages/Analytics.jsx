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

  if (!data) return <p className="container">Loading Analytics...</p>;

  const total = data.totalBugs || 0;
  const resolved = data.resolvedBugs || 0;
  const open = data.openBugs || 0;
  const progress = data.progressBugs || 0;

  const resolvedPercent = total > 0 ? Math.round((resolved / total) * 100) : 0;
  const openPercent = total > 0 ? Math.round((open / total) * 100) : 0;
  const progressPercent = total > 0 ? Math.round((progress / total) * 100) : 0;

  const high = data.highSeverity || 0;
  const medium = data.mediumSeverity || 0;
  const low = data.lowSeverity || 0;
  const totalSev = high + medium + low;

  const highPercent = totalSev > 0 ? Math.round((high / totalSev) * 100) : 0;
  const medPercent = totalSev > 0 ? Math.round((medium / totalSev) * 100) : 0;
  const lowPercent = totalSev > 0 ? Math.round((low / totalSev) * 100) : 0;

  // SVG Circular progress configurations
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (resolvedPercent / 100) * circumference;

  return (
    <div className="container">
      <h1 className="page-title">Analytics Dashboard</h1>

      {/* Numerical Cards Grid */}
      <div className="analytics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
        <div className="analytics-card card">
          <h2>{total}</h2>
          <p>Total Bugs Reported</p>
        </div>
        <div className="analytics-card card" style={{ borderLeft: "4px solid #f59e0b" }}>
          <h2>{open}</h2>
          <p>Open Status</p>
        </div>
        <div className="analytics-card card" style={{ borderLeft: "4px solid #3b82f6" }}>
          <h2>{progress}</h2>
          <p>In Progress</p>
        </div>
        <div className="analytics-card card" style={{ borderLeft: "4px solid #10b981" }}>
          <h2>{resolved}</h2>
          <p>Resolved / Closed</p>
        </div>
      </div>

      <div className="analytics-visuals" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "25px" }}>
        
        {/* Visual 1: SVG Progress Circle */}
        <div className="bug-card chart-card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "30px" }}>
          <h3>Completion Rate</h3>
          <div className="svg-container" style={{ position: "relative", width: "160px", height: "160px", margin: "20px 0" }}>
            <svg width="160" height="160" viewBox="0 0 160 160" style={{ transform: "rotate(-90deg)" }}>
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="12"
              />
              {/* Foreground circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="url(#progress-gradient)"
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s ease-out" }}
              />
              <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "28px", fontWeight: "700" }}>{resolvedPercent}%</span>
              <span style={{ fontSize: "11px", opacity: 0.6 }}>Resolved</span>
            </div>
          </div>
          <p style={{ fontSize: "14px", opacity: 0.7, textAlign: "center" }}>
            {resolved} out of {total} bugs have been fully fixed and closed.
          </p>
        </div>

        {/* Visual 2: Status Breakdown Meter */}
        <div className="bug-card chart-card" style={{ padding: "30px" }}>
          <h3>Status Breakdown</h3>
          <div style={{ marginTop: "20px" }}>
            
            {/* Open Item */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                <span>Open</span>
                <span>{open} ({openPercent}%)</span>
              </div>
              <div style={{ height: "10px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ width: `${openPercent}%`, height: "100%", background: "linear-gradient(135deg,#f59e0b,#d97706)", borderRadius: "10px", transition: "width 0.8s ease-out" }} />
              </div>
            </div>

            {/* In Progress Item */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                <span>In Progress</span>
                <span>{progress} ({progressPercent}%)</span>
              </div>
              <div style={{ height: "10px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ width: `${progressPercent}%`, height: "100%", background: "linear-gradient(135deg,#3b82f6,#2563eb)", borderRadius: "10px", transition: "width 0.8s ease-out" }} />
              </div>
            </div>

            {/* Resolved Item */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                <span>Resolved</span>
                <span>{resolved} ({resolvedPercent}%)</span>
              </div>
              <div style={{ height: "10px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ width: `${resolvedPercent}%`, height: "100%", background: "linear-gradient(135deg,#10b981,#059669)", borderRadius: "10px", transition: "width 0.8s ease-out" }} />
              </div>
            </div>

          </div>
        </div>

        {/* Visual 3: Severity Breakdown Meter */}
        <div className="bug-card chart-card" style={{ padding: "30px" }}>
          <h3>Severity Breakdown</h3>
          <div style={{ marginTop: "20px" }}>
            
            {/* High Severity */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                <span>High Severity</span>
                <span>{high} ({highPercent}%)</span>
              </div>
              <div style={{ height: "10px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ width: `${highPercent}%`, height: "100%", background: "linear-gradient(135deg,#ef4444,#b91c1c)", borderRadius: "10px", transition: "width 0.8s ease-out" }} />
              </div>
            </div>

            {/* Medium Severity */}
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                <span>Medium Severity</span>
                <span>{medium} ({medPercent}%)</span>
              </div>
              <div style={{ height: "10px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ width: `${medPercent}%`, height: "100%", background: "linear-gradient(135deg,#fb923c,#ea580c)", borderRadius: "10px", transition: "width 0.8s ease-out" }} />
              </div>
            </div>

            {/* Low Severity */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", fontWeight: 600, marginBottom: "6px" }}>
                <span>Low Severity</span>
                <span>{low} ({lowPercent}%)</span>
              </div>
              <div style={{ height: "10px", background: "rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
                <div style={{ width: `${lowPercent}%`, height: "100%", background: "linear-gradient(135deg,#94a3b8,#64748b)", borderRadius: "10px", transition: "width 0.8s ease-out" }} />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}