import React, { useState, useRef } from "react";
import Dropcss from "./Dropzone.module.css";
function DropZone(props) {
  const [hightlight, setHightlight] = useState(false);
  const fileInputRef = useRef();
  const openFileDialog = () => {
    if (props.disabled) return;
    fileInputRef.current.click();
  };

  const onFilesAdded = (evt) => {
    if (props.disabled) return;
    const files = evt.target.files;
    console.log(evt.target.files);
    if (props.onFilesAdded) {
      const array = fileListToArray(files);
      props.onFilesAdded(array);
    }
  };

  const onDragOver = (evt) => {
    evt.preventDefault();

    if (props.disabled) return;

    setHightlight({ hightlight: true });
  };

  const onDragLeave = () => {
    setHightlight({ hightlight: false });
  };

  const onDrop = (e) => {
    e.preventDefault();

    if (props.disabled) return;

    const files = e.dataTransfer.files;
    if (props.onFilesAdded) {
      const array = fileListToArray(files);
      props.onFilesAdded(array);
    }
    setHightlight({ hightlight: false });
  };

  const fileListToArray = (list) => {
    const array = [];
    for (var i = 0; i < list.length; i++) {
      array.push(list.item(i));
    }
    return array;
  };

  return (
    <div
      className={`${Dropcss.Dropzone} ${hightlight ? Dropcss.Highlight : null}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={openFileDialog}
      style={{ cursor: props.disabled ? "default" : "pointer" }}
    >
      <input
        ref={fileInputRef}
        className={Dropcss.FileInput}
        type="file"
        name="fileContainer"
        accept=".pdf, .pptx, image/*, .zip, .doc, .csv, .txt"
        multiple
        onChange={onFilesAdded}
      />
      <i
        className={`fa-solid fa-cloud-arrow-up ${Dropcss.Icon} fs-1`}
        style={{ color: "purple" }}
      ></i>
      <span>Upload Files</span>
    </div>
  );
}

export default DropZone;
