import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Helper/Contexts";
import InputForm from "../utility/inputForm";
import Csslogin from "./Login.module.css";

function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [error, setErros] = useState({
    email: "",
  });

  const userContextValue = useContext(UserContext);
  let navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8000/user/login", values)
      .then((item) => {
        userContextValue.setUser(item.data);
        userContextValue.setAuth(true);
        navigate("/", { replace: true });
      })
      .catch(({ response }) => {
        setErros({ email: response.data.error });
        setValues({
          email: "",
          password: "",
        });
      });
  };
  const handleChange = ({ currentTarget: input }) => {
    const data = { ...values };
    console.log(input.name);
    data[input.name] = input.value;
    setValues(data);
  };

  if (userContextValue.isAuth) return navigate("/", { replace: true });

  return (
    <div className={Csslogin.Login}>
      <div
        className="card"
        style={{
          width: "50rem",
          position: "absolute",
          marginTop: "100px",
          marginLeft: "550px",
        }}
      >
        <h1 className="text-center">Login Page</h1>
        <form onSubmit={handleSubmit} className="card-body">
          <div className="container">
            <div className="row">
              <div className="col"></div>
              <div className="col">
                <InputForm
                  value={values.email}
                  onChange={handleChange}
                  type="email"
                  name="email"
                  label="Email"
                  error={error.email}
                />
                <InputForm
                  value={values.password}
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

export default Login;
