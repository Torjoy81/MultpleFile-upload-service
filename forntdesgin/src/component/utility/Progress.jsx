import React from "react";
import progressCss from "./progress.module.css";
function Progress(props) {
  return (
    <div className={progressCss.ProgressBar}>
      <div
        className={progressCss.Progress}
        style={{ width: props.progress + "%" }}
      />
    </div>
  );
}

export default Progress;
