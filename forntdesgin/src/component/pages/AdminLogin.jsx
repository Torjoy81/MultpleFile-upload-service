import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CssAdmin from "./Login.module.css";
import InputForm from "../utility/inputForm";
import { UserContext } from "../../Helper/Contexts";

function AdminLogin() {
  const [AdminInfo, setAdmin] = useState({
    email: "",
    password: "",
  });
  const [error, setErros] = useState({
    email: "",
  });
  const { setAdminStatus } = useContext(UserContext);
  let navigate = useNavigate();
  const handleChange = ({ currentTarget: input }) => {
    const data = { ...AdminInfo };
    console.log(input.name);
    data[input.name] = input.value;
    setAdmin(data);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/admin/login", AdminInfo)
      .then(({ data }) => {
        const { _doc, adminAuth } = data;
        setAdminStatus({ ..._doc, adminAuth });
        navigate("/admin", { replace: true });
      })
      .catch(({ response }) => {
        setErros({ email: response.data.error });
        setAdmin({
          email: "",
          password: "",
        });
      });
  };
  return (
    <div className={CssAdmin.Login}>
      <div
        className="card"
        style={{
          width: "50rem",
          position: "absolute",
          marginTop: "100px",
          marginLeft: "550px",
        }}
      >
        <h1 className="text-center">Admin Login Page</h1>
        <form onSubmit={handleSubmit} className="card-body">
          <div className="container">
            <div className="row">
              <div className="col"></div>
              <div className="col">
                <InputForm
                  value={AdminInfo.email}
                  onChange={handleChange}
                  type="email"
                  name="email"
                  label="Email"
                  error={error.email}
                />
                <InputForm
                  value={AdminInfo.password}
                  onChange={handleChange}
                  type="password"
                  name="password"
                  label="Password"
                />

                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </div>
              <div className="col"></div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
