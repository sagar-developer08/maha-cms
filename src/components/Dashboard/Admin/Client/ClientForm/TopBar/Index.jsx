import React, { useContext } from "react";
import LangContext from "src/utils/LanguageContext";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
function Index(props) {
  const { isEdit, setIsEdit, handleSubmit, handleAddNewUser, isLoading, id } =
    props;
  const navigate = useNavigate();
  return (
    <div className="packagesTopBarEdit9dkd9">
      <div className="title">{isEdit ? "Edit" : "View"} Client</div>
      {/* <button className="btnNl btnNl-primary">{id ? "Update" : "Save"}</button> */}

      <div className="d-flex justify-content-end">
        {isEdit ? (
          <button
            className="btnNl btnNl-primary"
            onClick={() => (id ? handleSubmit() : handleAddNewUser())}
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        ) : (
          <button
            className="btnNl btnNl-primary"
            onClick={() => {
              setIsEdit(true);
            }}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default Index;
