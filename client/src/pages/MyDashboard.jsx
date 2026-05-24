import {
  useEffect,
  useState
} from "react";

import { Link } from "react-router-dom";

import api from "../api/axios";

export default function MyDashboard() {

  const [
    assigned,
    setAssigned
  ] = useState([]);

  const [
    reported,
    setReported
  ] = useState([]);

  const [
    recent,
    setRecent
  ] = useState([]);

  useEffect(() => {

    api.get("/bugs/dashboard/me")
      .then((res) => {

        setAssigned(res.data.assigned);
        setReported(res.data.reported);
        setRecent(res.data.recent);

      })
      .catch((err) =>
        console.log(err)
      );

  }, []);

  const renderBug = (bug) => (

    <div
      key={bug.id}
      className="bug-card"
    >

      <h3>
        {bug.title}
      </h3>

      <p>
        {bug.description}
      </p>

      <div className="badges">

        {/* STATUS */}
        <span
          className={`badge status-${bug.status
            .toLowerCase()
            .replace(" ", "-")}`}
        >
          {bug.status}
        </span>

        {/* SEVERITY */}
        <span
          className={`badge severity-${bug.severity.toLowerCase()}`}
        >
          {bug.severity}
        </span>

        {/* PRIORITY */}
        <span
          className={`badge severity-${bug.priority.toLowerCase()}`}
        >
          {bug.priority}
        </span>

      </div>

      <Link to={`/bug/${bug.id}`}>
        <button
          className="btn-primary"
          style={{
            marginTop: "10px"
          }}
        >
          View
        </button>
      </Link>

    </div>

  );

  return (

    <div className="container">

      <h2>
        My Workspace
      </h2>

      <hr />

      <h3>
        Assigned To Me
      </h3>

      {
        assigned.length === 0
          ? <p>No assigned bugs</p>
          : assigned.map(renderBug)
      }

      <hr />

      <h3>
        Reported By Me
      </h3>

      {
        reported.length === 0
          ? <p>No reported bugs</p>
          : reported.map(renderBug)
      }

      <hr />

      <h3>
        Recently Updated
      </h3>

      {
        recent.length === 0
          ? <p>No recent bugs</p>
          : recent.map(renderBug)
      }

    </div>

  );

}