import React, { useContext } from "react";
import thumb from "src/assets/pages/404Pg.webp";
import "./styles.scss";
import LangContext from "src/utils/LanguageContext";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
function Index() {
  const { lang = "en", setLang } = useContext(LangContext);
  const navigate = useNavigate();

  return (
    <div className="PageNotFound939d">
      <img className="notFoundThumb" src={thumb} alt="" />

      <div className="BtnWrapper">
        <button
          className="btnNl btnNl-primary"
          onClick={() => {
            navigate(-1);
            if (window.history.state && window.history.state.idx > 0) {
              navigate(-1);
            } else {
              navigate(`/${lang}`, { replace: true });
            }
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default Index;
