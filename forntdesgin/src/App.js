import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./component/pages/OverView";
import Login from "./component/pages/Login";
import SingUp from "./component/pages/SingUp";
import Admin from "./component/pages/Admin";
import { UserContext } from "./Helper/Contexts";
import Axios from "axios";
import AdminLogin from "./component/pages/AdminLogin";
import FileInfo from "./component/pages/FileInfo";

Axios.defaults.withCredentials = true;

function App() {
  const [user, setUser] = useState({});
  const [isAuth, setAuth] = useState(false);
  const [listofFile, setFile] = useState([]);
  const [adminInfo, setAdminInfo] = useState([]);
  const [statusAdmin, setAdminStatus] = useState({ adminAuth: false });

  useEffect(() => {
    Axios.get("http://localhost:8000/user/login")
      .then(({ data }) => {
        if (data.logedIn) {
          setAuth(true);
          setUser(data["_doc"]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    Axios.get("http://localhost:8000/filemanager")
      .then(({ data }) => {
        setFile(data);
      })
      .catch((err) => {
        console.log(err);
      });
    Axios.get("http://localhost:8000/admin")
      .then(({ data }) => {
        if (data) {
          setAdminInfo(data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  console.log(listofFile);

  return (
    <div>
      <UserContext.Provider
        value={{
          user,
          setUser,
          isAuth,
          setAuth,
          listofFile,
          adminInfo,
          setAdminInfo,
          setAdminStatus,
          statusAdmin,
          setFile,
        }}
      >
        <Routes>
          <Route index element={<Home isAuth={isAuth} admin={adminInfo} />} />
          <Route
            path="/admin"
            element={
              <Admin
                adminList={listofFile.filter((item) =>
                  adminInfo.some((value) => value.FileInfo === item._id)
                )}
              />
            }
          />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SingUp />} />
          <Route path="/file/:id" element={<FileInfo />} />
        </Routes>
      </UserContext.Provider>
    </div>
  );
}

export default App;
