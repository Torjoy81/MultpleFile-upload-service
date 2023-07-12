import axios from "axios";
import React, { useContext } from "react";
import NavBar from "../utility/NavBar";
import { UserContext } from "../../Helper/Contexts";

function Admin(props) {
  const { adminList } = props;
  const getIndex = (arr, id) => {
    return arr.findIndex((x) => x.FileInfo === id);
  };
  const { adminInfo, setAdminInfo } = useContext(UserContext);
  const handleblock = (id, requestStatus) => {
    console.log(requestStatus);
    if (requestStatus === "RequestForUnBlock") {
      axios
        .get(`http://localhost:8000/admin/requestUnBlock/${id}`)
        .then(({ data }) => {
          const Index = getIndex(adminInfo, data.FileInfo);
          const newArr = [...adminInfo];
          newArr[Index] = data;
          setAdminInfo(newArr);
        });
    } else {
      axios
        .get(`http://localhost:8000/admin/requestBlock/${id}`)
        .then(({ data }) => {
          const Index = getIndex(adminInfo, data.FileInfo);
          const newArr = [...adminInfo];
          newArr[Index] = data;
          setAdminInfo(newArr);
        });
    }
  };
  return (
    <React.Fragment>
      <NavBar NavName="FinalProject" />
      <div className="container">
        <div className="row">
          <div className="col"></div>
          <div className="col">
            <ul className="list-group">
              {adminList.map((item) => (
                <li
                  className={`list-group-item mt-3 border-top bg-info  position-relative p-3 ${
                    adminInfo[getIndex(adminInfo, item._id)].Status ===
                      "RequestForBlock" ||
                    adminInfo[getIndex(adminInfo, item._id)].Status ===
                      "RequestForUnBlock"
                      ? ""
                      : "d-none"
                  }`}
                  key={item._id}
                >
                  {item.originalName}
                  <button
                    type="button"
                    className="btn btn-danger"
                    style={{
                      position: "absolute",
                      right: "20px",
                      bottom: "8px",
                    }}
                    onClick={() =>
                      handleblock(
                        item._id,
                        adminInfo[getIndex(adminInfo, item._id)].Status
                      )
                    }
                    hidden={
                      adminInfo[getIndex(adminInfo, item._id)].Status ===
                        "Blocked" ||
                      adminInfo[getIndex(adminInfo, item._id)].Status ===
                        "UnBlocked"
                        ? true
                        : false
                    }
                  >
                    {adminInfo[getIndex(adminInfo, item._id)].Status ===
                    "RequestForBlock"
                      ? "Block"
                      : "UnBlock"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div className="col"></div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Admin;
