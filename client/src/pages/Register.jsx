import { useState } from "react";

import api from "../api/axios";

import {
  useNavigate
} from "react-router-dom";

export default function Register() {

  const nav = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const submit = async () => {

    // VALIDATIONS
    if (
      !data.name.trim() ||
      !data.email.trim() ||
      !data.password.trim()
    ) {
      return alert(
        "All fields are required"
      );
    }

    if (
      data.password.length < 6 ||
      data.password.length > 8
    ) {
      return alert(
        "Password must be between 6 and 8 characters"
      );
    }

    try {

      await api.post(
        "/auth/register",
        data
      );

      alert(
        "Registered successfully"
      );

      nav("/login");

    } catch {
      alert(
        "Error registering"
      );
    }
  };

  return (
    <div className="card">

      <h2>Register</h2>

      <input
        placeholder="Name"
        value={data.name}
        onChange={(e) =>
          setData({
            ...data,
            name: e.target.value
          })
        }
      />

      <input
        type="email"
        placeholder="Email"
        value={data.email}
        onChange={(e) =>
          setData({
            ...data,
            email: e.target.value
          })
        }
      />

      <input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={(e) =>
          setData({
            ...data,
            password:
              e.target.value
          })
        }
      />

      {/* PASSWORD MESSAGE */}
      <p
        style={{
          fontSize: "13px",
          marginTop: "-5px",
          marginBottom: "15px",
          color:
            data.password.length >= 6 &&
            data.password.length <= 8
              ? "green"
              : "red"
        }}
      >
        Password must contain 6 to 8 characters
      </p>

      <button
        className="btn-primary"
        onClick={submit}
      >
        Register
      </button>

    </div>
  );
}