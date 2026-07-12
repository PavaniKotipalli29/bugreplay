import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import {
  useState,
  useEffect
} from "react";

import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateBug from "./pages/CreateBug";
import BugDetails from "./pages/BugDetails";
import AdminPage from "./pages/AdminPage";
import PublicBug from "./pages/PublicBug";
import EditBug from "./pages/EditBug";
import MyDashboard from "./pages/MyDashboard";
import Analytics from "./pages/Analytics";
import Projects from "./pages/Projects";

import ProtectedRoute
  from "./components/ProtectedRoute";

export default function App() {

  const [theme, setTheme] =
    useState(
      localStorage.getItem("theme")
      || "light"
    );

  useEffect(() => {

    document.body.className =
      theme;

    localStorage.setItem(
      "theme",
      theme
    );

  }, [theme]);

  return (

    <BrowserRouter>

      <Navbar theme={theme} setTheme={setTheme} />

      <div className="container">

        <Routes>

          {/* MAIN DASHBOARD */}
          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* AUTH */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          {/* CREATE BUG */}
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateBug />
              </ProtectedRoute>
            }
          />

          {/* MY WORKSPACE */}
          <Route
            path="/my-dashboard"
            element={
              <ProtectedRoute>
                <MyDashboard />
              </ProtectedRoute>
            }
          />

          {/* BUG DETAILS */}
          <Route
            path="/bug/:id"
            element={<BugDetails />}
          />

          {/* EDIT BUG */}
          <Route
            path="/edit-bug/:id"
            element={
              <ProtectedRoute>
                <EditBug />
              </ProtectedRoute>
            }
          />

          {/* PUBLIC SHARE */}
          <Route
            path="/share/bug/:id"
            element={<PublicBug />}
          />

          {/* ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* ANALYTICS */}
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            }
          />

          {/* PROJECTS */}
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />

        </Routes>

      </div>

    </BrowserRouter>

  );

}