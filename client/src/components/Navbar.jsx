import {
  Link,
  useNavigate,
  useLocation
} from "react-router-dom";

import {
  useEffect,
  useState
} from "react";

export default function Navbar() {

  const nav = useNavigate();

  const location =
    useLocation();

  const [user, setUser] =
    useState(null);

  const [open, setOpen] =
    useState(false);

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


        {/* LOGIN / REGISTER */}
        {!user && (
          <>

            <Link to="/login">
              Login
            </Link>

            <Link to="/register">
              Register
            </Link>

          </>
        )}

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

      </div>

    </nav>

  );

}