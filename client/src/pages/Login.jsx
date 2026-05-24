import { useState } from "react";

import api from "../api/axios";

import {
  useNavigate
} from "react-router-dom";

import {
  showToast
} from "../utils/toast";

export default function Login() {
  const nav = useNavigate();

  const [data, setData] =
    useState({
      email: "",
      password: ""
    });

  const submit = async () => {
    try {
      const res =
        await api.post(
          "/auth/login",
          data
        );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );

      localStorage.setItem(
        "role",
        res.data.user.role
      );

      localStorage.setItem(
        "name",
        res.data.user.name
      );

      window.dispatchEvent(
        new Event("authChange")
      );

      showToast(
        "Login successful"
      );

      nav("/");

    } catch (err) {
      console.log(err);

      showToast(
        "Login failed",
        "error"
      );
    }
  };

  return (
    <div className="card">
      <h2>Login</h2>

      <input
        placeholder="Email"
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
        onChange={(e) =>
          setData({
            ...data,
            password:
              e.target.value
          })
        }
      />

      <button
        className="btn-primary"
        onClick={submit}
      >
        Login
      </button>
    </div>
  );
}