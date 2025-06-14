import React from "react";
import "./styles.scss";
function Index(props) {
  return (
    <div className="genInfoCdi30">
      <div className="name">
        {props?.icon}
        <div className="title">{props?.title}</div>
      </div>
      <div className="info">{props?.loading ? "loading..." : props?.info}</div>
    </div>
  );
}

export default Index;
