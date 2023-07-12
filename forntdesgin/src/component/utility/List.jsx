import axios from "axios";
import React, { useState, useContext } from "react";
import { UserContext } from "../../Helper/Contexts";
import { Link } from "react-router-dom";

function List(props) {
  const { adminInfo, setAdminInfo } = useContext(UserContext);
  const [copy, setCopy] = useState({
    id: "",
    isCopied: false,
  });

  const getIndex = (arr, id) => {
    return arr.findIndex((x) => x.FileInfo === id);
  };
  const copyTextToClipboard = async (text, id) => {
    if ("clipboard" in navigator) {
      setCopy({
        id: id,
        isCopied: true,
      });
      handleCopy();
      return await navigator.clipboard.writeText(text);
    }
  };
  const reqBlock = (id) => {
    if (adminInfo.some((item) => item.FileInfo === id)) {
      axios
        .put(`http://localhost:8000/admin/${id}`, {
          status:
            adminInfo[getIndex(adminInfo, id)].Status === "UnBlocked"
              ? "RequestForBlock"
              : "RequestForUnBlock",
        })
        .then(({ data }) => {
          const Index = getIndex(adminInfo, data.FileInfo);
          const newArr = [...adminInfo];
          newArr[Index] = data;
          setAdminInfo(newArr);
        });
    } else {
      axios
        .post("http://localhost:8000/admin", {
          ID: id,
          status: "RequestForBlock",
        })
        .then(({ data }) => {
          console.log(data);
        });
    }
  };
  const handleCopy = () => {
    setTimeout(() => {
      setCopy({
        id: "",
        isCopied: false,
      });
    }, 4500);
  };

  return (
    <ul className="list-group ">
      {props.allLsit.map((item) => (
        <li
          className="list-group-item mt-3 border-top border-primary p-3"
          key={item._id}
        >
          <div className="container-fluid">
            <div className="row">
              <div className="col">
                <Link to={{ pathname: `/file/${item._id}` }}>
                  {item.originalName}
                </Link>
              </div>
              <div className="col">
                <span className="badge bg-info">
                  {adminInfo.length > 0 &&
                  adminInfo.some((valu) => valu.FileInfo === item._id)
                    ? adminInfo[getIndex(adminInfo, item._id)].Status
                    : "Not Request"}
                </span>
              </div>
              <div className="col">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() =>
                    copyTextToClipboard(
                      `http://localhost:8000/filemanager/${item._id}`,
                      item._id
                    )
                  }
                  disabled={
                    adminInfo.some((valu) => valu.FileInfo === item._id)
                      ? adminInfo[getIndex(adminInfo, item._id)].Status ===
                          "Blocked" ||
                        adminInfo[getIndex(adminInfo, item._id)].Status ===
                          "RequestForUnBlock"
                        ? true
                        : false
                      : false
                  }
                >
                  <span>
                    {copy.isCopied && copy.id === item._id ? "Copied!" : "Copy"}
                  </span>
                </button>
                {props.isAuth && (
                  <button
                    type="button"
                    className="btn btn-danger "
                    onClick={() => reqBlock(item._id)}
                    hidden={
                      adminInfo.some((valu) => valu.FileInfo === item._id) &&
                      adminInfo[getIndex(adminInfo, item._id)].Status.includes(
                        "RequestFor"
                      )
                        ? true
                        : false
                    }
                  >
                    <span>
                      {adminInfo.some((value) => value.FileInfo === item._id)
                        ? adminInfo[getIndex(adminInfo, item._id)].Status ===
                          "UnBlocked"
                          ? "Requesting Block"
                          : "Requesting UnBlock"
                        : "Requesting Block"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default List;
