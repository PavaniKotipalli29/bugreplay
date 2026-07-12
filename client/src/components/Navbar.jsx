import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

import api from "../api/axios";

export default function Navbar({ theme, setTheme }) {

  const nav = useNavigate();

  const location =
    useLocation();

  const [user, setUser] =
    useState(null);

  const [open, setOpen] =
    useState(false);

  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {

    loadUser();

    window.addEventListener(
      "authChange",
      loadUser
    );

    return () => {

      window.removeEventListener(
        "authChange",
        loadUser
      );

    };

  }, []);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 10000);
      return () => clearInterval(interval);
    } else {
      setNotifications([]);
    }
  }, [user]);

  const loadUser = () => {

    const stored =
      localStorage.getItem("user");

    if (stored) {

      setUser(
        JSON.parse(stored)
      );

    } else {

      setUser(null);

    }

  };

  const logout = () => {

    localStorage.clear();

    setUser(null);

    window.dispatchEvent(
      new Event("authChange")
    );

    nav("/login");

  };

  const hideNavbar =

    location.pathname === "/login"
    ||
    location.pathname === "/register";

  if (hideNavbar)
    return null;

  return (

    <nav className="navbar">

      <Link
        to="/"
        className="logo"
      >
        BugReplay
      </Link>

      <div className="nav-links">

        {/* DASHBOARD */}
        <Link to="/">
          Dashboard
        </Link>

        {/* MY WORKSPACE */}
        {user && (

          <Link to="/my-dashboard">
            My Workspace
          </Link>

        )}

        {/* CREATE BUG */}
        {user && (

          <Link to="/create">
            Create Bug
          </Link>

        )}

        {/* ANALYTICS */}
        {user && (

          <Link to="/analytics">
            Analytics
          </Link>

        )}

        {/* PROJECTS */}
        {user && (

          <Link to="/projects">
            Projects
          </Link>

        )}

        {/* NOTIFICATIONS */}
        {user && (
          <div className="profile" style={{ marginRight: "8px" }}>
            <button
              className="profile-btn"
              onClick={() => {
                setNotifOpen(!notifOpen);
                setOpen(false);
              }}
              style={{ position: "relative", background: "linear-gradient(135deg, #f59e0b, #d97706)" }}
            >
              🔔
              {notifications.filter(n => !n.is_read).length > 0 && (
                <span className="badge-count">
                  {notifications.filter(n => !n.is_read).length}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="dropdown notif-dropdown">
                <div className="notif-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid rgba(0,0,0,0.1)", paddingBottom: "6px" }}>
                  <h4 style={{ margin: 0 }}>Notifications</h4>
                  <button 
                    onClick={markAllRead} 
                    style={{ fontSize: "11px", padding: "4px 8px", background: "var(--primary)" }}
                  >
                    Clear All
                  </button>
                </div>
                <div className="notif-list" style={{ maxHeight: "240px", overflowY: "auto" }}>
                  {notifications.length === 0 ? (
                    <p style={{ fontSize: "12px", opacity: 0.6, margin: "10px 0", textAlign: "center" }}>No alerts</p>
                  ) : (
                    notifications.map((n) => (
                      <div 
                        key={n.id} 
                        className="notif-item"
                        style={{ 
                          padding: "8px 4px", 
                          borderBottom: "1px solid rgba(148,163,184,0.1)", 
                          fontSize: "12px",
                          opacity: n.is_read ? 0.65 : 1,
                          fontWeight: n.is_read ? "normal" : "600"
                        }}
                      >
                        <div>{n.message}</div>
                        <div style={{ fontSize: "10px", opacity: 0.5, marginTop: "2px" }}>
                          {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* THEME TOGGLE */}
        <button
          className="theme-toggle-btn"
          onClick={() =>
            setTheme(theme === "light" ? "dark" : "light")
          }
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          style={{
            width: "44px",
            height: "44px",
            background: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "white",
            borderRadius: "14px",
            cursor: "pointer",
            fontSize: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            transition: "all 0.3s",
            marginRight: "8px"
          }}
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {/* PROFILE */}
        {user && (

          <div className="profile">

            <button
              className="profile-btn"
              onClick={() =>
                setOpen(!open)
              }
            >
              👤
            </button>

            {open && (

              <div className="dropdown">

                <p className="username">
                  {user.name}
                </p>

                <p
                  style={{
                    fontSize: "13px",
                    opacity: 0.7,
                    marginBottom: "10px"
                  }}
                >
                  {user.role}
                </p>

                <button
                  onClick={logout}
                >
                  Logout
                </button>

              </div>

            )}

          </div>

        )}

        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

      </div>

    </nav>

  );

}