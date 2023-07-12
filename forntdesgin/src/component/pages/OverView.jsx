import React, { useContext } from "react";
import List from "../utility/List";
import NavBar from "../utility/NavBar";
import Upload from "../utility/upload";
import HomeCss from "./Home.module.css";
import { UserContext } from "../../Helper/Contexts";

function Home(props) {
  const userContextValue = useContext(UserContext);

  return (
    <div className={props.isAuth ? HomeCss.App : ""}>
      <NavBar NavName="FinalProject" />
      <div className="container-fluid mt-5">
        <div className="row">
          <div className="col-4">
            {props.isAuth && (
              <div className={HomeCss.Card}>
                <Upload />
              </div>
            )}
          </div>
          <div className="col">
            {props.admin.length > 0 && (
              <List
                allLsit={userContextValue.listofFile}
                isAuth={props.isAuth}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
