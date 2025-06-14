import React, { useContext } from "react";
import LangContext from "src/utils/LanguageContext";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
function Index(props) {
  const { id } = props;
  const { lang = "en", setLang } = useContext(LangContext);
  const navigate = useNavigate();
  return (
    <div className="packagesTopBarEdit9dkd9">
      <div className="title">{id ? "Edit" : "Add"} Blog</div>
      <button className="btnNl btnNl-primary">{id ? "Update" : "Save"}</button>
    </div>
  );
}

export default Index;
