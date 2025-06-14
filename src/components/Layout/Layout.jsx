import React, { useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import Sidenav from "src/components/common/SideNav/Index";
import TopBar from "src/components/common/TopBar/Index";
import { useDispatch, useSelector } from "react-redux";
import "./styles.scss";
import useSize from "src/utils/useSize";
import { setIsCollpase, setMobileHover } from "src/store/NavCollpase";
function Layout() {
  const { isCollapse } = useSelector((state) => state.nav);
  const { width } = useSize();
  const dispatch = useDispatch();
  useEffect(() => {
    if (width <= 580) {
      dispatch(setIsCollpase(true));
      dispatch(setMobileHover(false));
    }
  }, [width]);
  return (
    <div className="Main39Wrapper">
      <div className="Dash">
        <Sidenav />
        <main className={isCollapse ? "content NavClose  " : "content NavOpen"}>
          <TopBar />
          <div
            className={
              isCollapse
                ? "MainContainer contianerClose"
                : "MainContainer containerOpen"
            }
          >
            <Outlet />
          </div>
        </main>
      </div>
      {/* footer */}
    </div>
  );
}

export default Layout;
