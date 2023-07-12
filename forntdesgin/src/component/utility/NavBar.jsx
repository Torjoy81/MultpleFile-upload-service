import axios from "axios";
import React, { useContext } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { UserContext } from "../../Helper/Contexts";

function NavBar(props) {
  const { user, statusAdmin, isAuth, setAdminStatus } = useContext(UserContext);
  let navigate = useNavigate();
  let location = useLocation();
  console.log(location.pathname);
  const handleLogout = () => {
    axios.get("http://localhost:8000/admin/logout").then(({ data }) => {
      setAdminStatus(data);
      navigate("/admin/login", { replace: true });
    });
  };
  return (
    <React.Fragment>
      <nav
        className="navbar navbar-expand-lg navbar-light position-relative"
        style={{ backgroundColor: "#e3f2fd" }}
      >
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/">
            {props.NavName}
          </NavLink>

          <div
            className="collapse navbar-collapse position-absolute"
            style={{ right: "10px" }}
            id="navbarNav"
          >
            <ul className="navbar-nav">
              {location.pathname !== "/admin" ? (
                isAuth ? (
                  <React.Fragment>
                    <li className="nav-item">
                      <a
                        className="nav-link active"
                        aria-current="page"
                        href="#"
                      >
                        {user.userName}
                      </a>
                    </li>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/signup">
                        Signup
                      </NavLink>
                    </li>
                    <li className="nav-item">
                      <NavLink className="nav-link" to="/login">
                        Login
                      </NavLink>
                    </li>
                  </React.Fragment>
                )
              ) : null}
              {!statusAdmin.adminAuth ? (
                <li className="nav-item">
                  <NavLink className="nav-link" to="/admin/login">
                    Admin
                  </NavLink>
                </li>
              ) : (
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    onClick={handleLogout}
                    to={{ pathname: "#" }}
                  >
                    Logout
                  </NavLink>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </React.Fragment>
  );
}

export default NavBar;
