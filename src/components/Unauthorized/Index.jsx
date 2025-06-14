import React, { useContext } from "react";
import thumb from "src/assets/pages/unauth.jpg";
import LangContext from "src/utils/LanguageContext";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import { LogoutUser } from "src/store/auth";
import { useDispatch } from "react-redux";
function Index() {
  const { lang = "en", setLang } = useContext(LangContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="UnAuthorizedPaged3939d">
      <img className="imgThumb" src={thumb} alt="" />
      <div className="title">401 Unauthorized</div>
      <div className="BtnWrapper">
        <button
          className="btnNl btnNl-primary"
          onClick={() => {
            dispatch(LogoutUser());
            navigate(`/${lang}`, { replace: true });
          }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
}

export default Index;
