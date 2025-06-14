import React, { useContext, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import Icon from "src/assets/logo.png";
import NavIcon from "src/assets/icons/NavOpenIcon.svg";
import AdminNavList from "./AdminNavItems";
import CustomerNavList from "./CustomerNavItems";
import LangContext from "src/utils/LanguageContext";
import { setIsCollpase, setMobileHover } from "src/store/NavCollpase";
import { useDispatch, useSelector } from "react-redux";
import { IoMdCloseCircle } from "react-icons/io";
import "./styles.scss";
// navIcons

function Index() {
  const { lang = "en", setLang } = useContext(LangContext);
  const { isCollapse, isNavHover } = useSelector((state) => state.nav);
  const { role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  return (
    <div
      className={
        !isNavHover ? "ClosedSidebar SideNav93" : "OpenedSidebar SideNav93"
      }
    >
      <div className="navWrapper">
        <Sidebar
          collapsed={isCollapse}
          className="sideBarNav"
          backgroundColor={"#FFFFFF"}
        >
          <Menu>
            <MenuItem className="NavBrandWrapper">
              <div className="NavBrand">
                <div className="BrandIcon">
                  <img
                    onClick={() => {
                      dispatch(setIsCollpase(!isCollapse));
                    }}
                    className="brand_logo"
                    src={Icon}
                    alt=""
                    width={40}
                    height={40}
                  />
                  <div className="brand_name">Maha Balloons</div>
                </div>
                <img
                  className="nav_thumb"
                  src={NavIcon}
                  alt=""
                  height={12}
                  onClick={() => {
                    dispatch(setIsCollpase(true));
                  }}
                />
              </div>
            </MenuItem>
            {role == "admin"
              ? AdminNavList?.map((item) => (
                  <MenuItem
                    className={`n_item ${
                      location?.pathname == `/${lang}${item?.route}`
                        ? "active"
                        : "pds"
                    }`}
                    component={<Link to={`/${lang}${item?.route}`} />}
                  >
                    {isCollapse ? (
                      <>{item?.IconNav}</>
                    ) : (
                      <>
                        {item?.IconNav} {item?.title}
                      </>
                    )}
                  </MenuItem>
                ))
              : CustomerNavList?.map((item) => (
                  <MenuItem
                    className={`n_item ${
                      location?.pathname == `/${lang}${item?.route}`
                        ? "active"
                        : "pds"
                    }`}
                    component={<Link to={`/${lang}${item?.route}`} />}
                  >
                    {isCollapse ? (
                      <>{item?.IconNav}</>
                    ) : (
                      <>
                        {item?.IconNav} {item?.title}
                      </>
                    )}
                  </MenuItem>
                ))}

            <MenuItem
              className={`n_item  navClose MobileCLose`}
              component={<Link to={``} />}
              onClick={() => {
                dispatch(setMobileHover(false));
                dispatch(setIsCollpase(true));
              }}
            >
              {isCollapse ? (
                <IoMdCloseCircle size={18} />
              ) : (
                <>
                  <IoMdCloseCircle size={18} /> Hide
                </>
              )}
            </MenuItem>
          </Menu>
        </Sidebar>
      </div>
    </div>
  );
}

export default Index;
