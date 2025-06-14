import React from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "./styles.scss";
function Index(props) {
  const { openTab, setOpenTab } = props;
  return (
    <div className="TabBarNav323d">
      <Tabs
        defaultActiveKey="profile"
        id="uncontrolled-tab-example"
        activeKey={openTab}
        onSelect={(k) => setOpenTab(k)}
      >
        <Tab eventKey={"1"} title={"Update Profile"}>
          {/* Approved */}
        </Tab>
        {/* <Tab eventKey={"2"} title={"Users"}> */}
        {/* Approved */}
        {/* </Tab> */}
      </Tabs>
    </div>
  );
}

export default Index;
