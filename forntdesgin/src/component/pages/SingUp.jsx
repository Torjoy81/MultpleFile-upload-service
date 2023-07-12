import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../Helper/Contexts";
import Joi from "joi-browser";
import InputForm from "../utility/inputForm";
import axios from "axios";
import CsssignUp from "./Login.module.css";
function Register() {
  const [values, setValues] = useState({
    Name: "",
    email: "",
    password: "",
  });

  const [error, setErros] = useState({});
  let navigate = useNavigate();
  const userContextValue = useContext(UserContext);
  const Schema = {
    Name: Joi.string().min(5).max(50).required(),
    email: Joi.string().email().min(5).max(50).required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{8,30}$/)
      .required(),
  };

  const validate = () => {
    const result = Joi.validate(values, Schema, { abortEarly: false });
    console.log(result);
    const { error } = result;
    if (!error) return null;
    const errorData = {};
    for (let item of error.details) {
      const name = item.path[0];
      const message = item.message;
      errorData[name] = message;
    }

    setErros(errorData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    validate();
    axios
      .post("http://localhost:8000/user/signup", values)
      .then(() => {
        navigate("/login", { replace: true });
      })
      .catch((err) => console.log(err));
  };
  const handleChange = ({ currentTarget: input }) => {
    const data = { ...values };
    console.log(data);
    data[input.name] = input.value;
    setValues(data);
  };
  if (userContextValue.isAuth) return navigate("/", { replace: true });
  return (
    <div className={CsssignUp.Login}>
      <div
        className="card"
        style={{
          width: "50rem",
          position: "absolute",
          marginTop: "100px",
          marginLeft: "550px",
        }}
      >
        <h1 className="text-center">Registeration</h1>
        <form onSubmit={handleSubmit} className="card-body">
          <div className="container">
            <div className="row">
              <div className="col"></div>
              <div className="col">
                <InputForm
                  value={values.Name}
                  onChange={handleChange}
                  type="text"
                  name="Name"
                  label="FullName"
                  error={error.Name}
                />
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
                  error={error.password}
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
export default Register;
