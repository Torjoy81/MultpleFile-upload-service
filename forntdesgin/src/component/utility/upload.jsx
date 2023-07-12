import React, { useState, useContext } from "react";
import uploadCss from "./upload.module.css";
import DropZone from "./Dropzone";
import Progress from "./Progress";
import { UserContext } from "../../Helper/Contexts";
import axios from "axios";

function Upload(props) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [successfullUploaded, setSuccessfullUploaded] = useState(false);
  const [fileError, setErrors] = useState({ error: "" });
  const { user, setFile } = useContext(UserContext);

  const onFilesAdded = (files) => {
    console.log(files);
    setFiles((prevState) => [...prevState, ...files]);
  };
  const renderProgress = (file) => {
    const uploadProgresses = uploadProgress[file.name];
    if (uploading || successfullUploaded) {
      return (
        <div className={uploadCss.ProgressWrapper}>
          <Progress
            progress={uploadProgresses ? uploadProgress.percentage : 0}
          />
          <i
            className={`${uploadCss.CheckIcon} fa-solid fa-horizontal-rule`}
            style={{
              opacity:
                uploadProgress && uploadProgress.state === "done" ? 0.5 : 0,
            }}
          />
        </div>
      );
    }
  };

  const renderActions = () => {
    if (successfullUploaded) {
      return (
        <button
          onClick={() => {
            setSuccessfullUploaded(false);
            setFiles([]);
          }}
        >
          Clear
        </button>
      );
    } else {
      return (
        <button disabled={files.length < 0 || uploading} onClick={handleSubmit}>
          Upload
        </button>
      );
    }
  };

  const handleSubmit = () => {
    files.forEach((file) => {
      const formData = new FormData();
      formData.append("id", user._id);
      formData.append("fileContainer", file);

      console.log(formData);
      axios
        .post("http://localhost:8000/filemanager/uploadFile", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(async (item) => {
          const { data } = await item;

          await setFile((oldFile) => [...oldFile, data]);

          setFiles([]);
          setUploadProgress({});
          setSuccessfullUploaded(true);
        })
        .catch((err) => {
          console.log(err);
          setErrors(err.response.data);
          setFiles([]);
          setSuccessfullUploaded(false);
        });
    });
  };

  return (
    <div className={uploadCss.Upload}>
      <span className={uploadCss.Title}>Upload Files</span>
      <div className={uploadCss.Content}>
        <div>
          <DropZone
            onFilesAdded={onFilesAdded}
            disabled={uploading || successfullUploaded}
          />
        </div>
        <div className={uploadCss.Files}>
          // Add this:
          {files.map((file) => {
            return (
              <div key={file.name} className={uploadCss.Row}>
                <span className={uploadCss.Filename}>{file.name}</span>
                {renderProgress(file)}
              </div>
            );
          })}
        </div>
      </div>
      {fileError.error ? (
        <div className="form-text text-danger">{fileError.error}</div>
      ) : (
        <div className={uploadCss.Actions}>{renderActions()}</div>
      )}
    </div>
  );
}

export default Upload;
