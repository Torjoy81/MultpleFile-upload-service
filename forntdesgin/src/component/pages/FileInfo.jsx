import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../Helper/Contexts";
import NavBar from "../utility/NavBar";
function FileInfo(props) {
  const { listofFile } = useContext(UserContext);
  const { id } = useParams();
  const fileObject = listofFile.filter((file) => file._id === id);
  const d = new Date(fileObject[0].date);

  return (
    <React.Fragment>
      <NavBar NavName="FileUploadAndShare" />
      <div
        className="card mb-3 position-relative"
        style={{
          maxWidth: "540px",
          position: "absolute",
          marginTop: "100px",
          marginLeft: "550px",
        }}
      >
        <div className="row g-0">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <p>
              <span className="fw-bold">File Name:</span>
              <span className="fst-italic"> {fileObject[0].originalName}</span>
            </p>
            <p>
              <span className="fw-bold">Size: </span>
              <span className="fst-italic">
                {" "}
                {Math.round(fileObject[0].size / 1024)} KB
              </span>
            </p>
            <p>
              <span className="fw-bold">MimeType : </span>
              <span className="fst-italic"> {fileObject[0].contentType}</span>
            </p>
            <p>
              <span className="fw-bold">Publish : </span>
              <span className="fst-italic">{d.toDateString()}</span>
            </p>
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default FileInfo;
