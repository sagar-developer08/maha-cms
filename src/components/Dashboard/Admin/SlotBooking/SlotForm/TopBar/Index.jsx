import React from "react";
import "./styles.scss";

function Index(props) {
  const { id } = props;
  return (
    <div className="packagesTopBarEdit9dkd9">
      <div className="title">{id ? "Edit" : "Add"} Booking Slots</div>
      <button className="btnNl btnNl-primary">{id ? "Update" : "Save"}</button>
    </div>
  );
}

export default Index;
