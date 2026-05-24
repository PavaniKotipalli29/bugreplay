import { useEffect, useState } from "react";
import api from "../api/axios";

export default function ActivityTimeline({ bugId }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    api.get(`/activity/${bugId}`)
      .then(res => setLogs(res.data))
      .catch(console.error);
  }, [bugId]);

  return (
    <div>
      <h3>Activity Timeline</h3>

      {logs.length === 0 ? (
        <p>No activity yet</p>
      ) : (
        logs.map(log => (
          <div key={log.id}>
            <strong>{log.user_name}</strong>
            {" "}
            {log.action}

            <br />

            <small>
              {new Date(log.created_at)
                .toLocaleString()}
            </small>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}