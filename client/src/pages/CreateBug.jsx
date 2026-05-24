import { useState } from "react";

import api from "../api/axios";

export default function CreateBug() {

  const [data, setData] = useState({
    title: "",
    description: "",
    expected_result: "",
    actual_result: "",
    severity: "Low",
    status: "Open"
  });

  const submit = async () => {

    // VALIDATION
    if (
      !data.title.trim() ||
      !data.description.trim() ||
      !data.expected_result.trim() ||
      !data.actual_result.trim()
    ) {
      return alert(
        "Please fill all bug details"
      );
    }

    try {

      await api.post(
        "/bugs",
        data
      );

      alert("Bug created!");

      window.location.href = "/";

    } catch {

      alert(
        "Failed - Are you logged in?"
      );
    }
  };

  return (

    <div className="card">

      <h2>Create Bug</h2>

      <input
        placeholder="Title"
        value={data.title}
        onChange={e =>
          setData({
            ...data,
            title: e.target.value
          })
        }
      />

      <textarea
        placeholder="Description"
        value={data.description}
        onChange={e =>
          setData({
            ...data,
            description: e.target.value
          })
        }
      />

      <textarea
        placeholder="Expected Result"
        value={data.expected_result}
        onChange={e =>
          setData({
            ...data,
            expected_result:
              e.target.value
          })
        }
      />

      <textarea
        placeholder="Actual Result"
        value={data.actual_result}
        onChange={e =>
          setData({
            ...data,
            actual_result:
              e.target.value
          })
        }
      />

      <select
        value={data.severity}
        onChange={e =>
          setData({
            ...data,
            severity:
              e.target.value
          })
        }
      >
        <option>
          Low
        </option>

        <option>
          Medium
        </option>

        <option>
          High
        </option>
      </select>

      <button
        className="btn-primary"
        onClick={submit}
      >
        Submit
      </button>

    </div>
  );
}