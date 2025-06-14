import React, { useContext } from "react";
import LangContext from "src/utils/LanguageContext";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
function Index() {
  const { lang = "en", setLang } = useContext(LangContext);
  const navigate = useNavigate();
  return (
    <div className="packagesTopBar9dkd9">
      <div className="title">My Packages</div>
      <button
        className="btnNl btnNl-primary"
        onClick={() => {
          navigate(`/${lang}/admin/package/add`);
        }}
      >
        Add New
      </button>
    </div>
  );
}

export default Index;
