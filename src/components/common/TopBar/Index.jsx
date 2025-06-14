import React from "react";
import { IoSearchOutline } from "react-icons/io5";
import CoinIcon from "src/assets/icons/coin.svg";
import profile from "src/assets/profile.png";
import NavIcon from "src/assets/icons/NavOpenIcon.svg";
import Dropdown from "react-bootstrap/Dropdown";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { setMobileHover } from "src/store/NavCollpase";
import { Container } from "react-bootstrap";
import { LogoutUser } from "src/store/auth";
import { useLocation, useNavigate, useParams } from "react-router-dom";
function Index() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { isNavHover } = useSelector((state) => state.nav);
  const UserAuth = useSelector((state) => state.auth);

  const { lang = "en" } = useParams();

  let location = useLocation();
  let urlText = location?.pathname.split("/");

  return (
    <div className="topNavbar33l">
      <div className="sec-title">
        {location?.pathname?.includes("dashboard")
          ? "Welcome"
          : location?.pathname?.includes("add")
          ? urlText?.[urlText?.length - 2]?.replaceAll("-", " ")
          : location?.pathname?.includes("edit")
          ? urlText?.[urlText?.length - 3]?.replaceAll("-", " ")
          : urlText?.[urlText?.length - 1]?.replaceAll("-", " ")}
      </div>

      <div className="SearchBar">
        <IoSearchOutline size={20} />
        <input type="text" placeholder="Start Typing to search" />
      </div>

      <div className="UserInfo">
        <img
          className="nav_thumb"
          src={NavIcon}
          alt=""
          height={12}
          onMouseEnter={() => {
            dispatch(setMobileHover(true));
          }}
        />
        <div className="InfoLang">
          {/* <div className="walletAmount">
            <img src={CoinIcon} alt="" />
            $200
          </div> */}
          <div className="Lang">
            <select name="lang">
              <option value="EN">EN</option>
              <option value="AR">AR</option>
            </select>
          </div>
        </div>
        <div className="UserDetails">
          <img className="avatarProfile" src={profile} alt="" />
          <Dropdown>
            <Dropdown.Toggle className="mainThumb" id="dropdown-basic">
              Hi, {UserAuth?.userData?.first_name || "User"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <div className="dropList">
                <div
                  className="drop_item "
                  onClick={() => {
                    if (UserAuth?.role == "admin") {
                      navigate(`/${lang}/admin/my-account`);
                    } else {
                      navigate(`/${lang}/customer/my-account`);
                    }
                  }}
                >
                  Settings
                </div>
                <Dropdown.Divider />
                <div
                  className="drop_item logout"
                  onClick={() => dispatch(LogoutUser())}
                >
                  Logout
                </div>
              </div>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}

export default Index;
