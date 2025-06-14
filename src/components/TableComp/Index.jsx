import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
// import { MainSiteUrl } from "src/config/main";
import { FaCalendarDays } from "react-icons/fa6";
import "./styles.scss";
import { useSelector } from "react-redux";
import { getPackage } from "src/api/packagesAPI";
import { toast } from "react-toastify";
function Index(props) {
  const {
    setActiveTab,
    openTab,
    setOpenTab,
    showBookingOption = true,
    showTabs = true,
  } = props;

  const userId = useSelector((state) => state?.auth?.userData?.id);
  const [packageID, setpackageID] = useState("");
  const [packageList, setpackageList] = useState([]);

  const MainSiteUrl = `${
    import.meta.env.VITE_mainSiteLink
  }?book=true&booked_by=${userId}&package=${packageID}`;

  const getPackagesList = async () => {
    const response = await getPackage();
    if (response?.status == 200 || response?.status == 201) {
      setpackageList(response?.data);
    } else {
      toast.error("Something went wrong with Packages API");
    }
  };

  useEffect(() => {
    if (showBookingOption) {
      getPackagesList();
    }
  }, []);

  return (
    <div className="DataTableComp9393">
      {props?.title && <div className="title">{props?.title}</div>}
      {showTabs && (
        <div className="d-flex justify-content-start align-content-center flex-wrap">
          <Tabs
            defaultActiveKey="profile"
            id="uncontrolled-tab-example"
            className="mb-3"
            activeKey={openTab}
            onSelect={(k) => {
              setOpenTab(k);
              setActiveTab(k);
            }}
          >
            {props?.tabs?.map((item) => (
              <Tab eventKey={item?.key} title={item?.title}></Tab>
            ))}
          </Tabs>
        </div>
      )}
      {showBookingOption && (
        <div className="d-flex justify-content-end align-content-center flex-wrap">
          <div className="bTnWrapper">
            <div>
              <select
                className="packages_Data"
                name="packagesId"
                onChange={(e) => setpackageID(e.target.value)}
              >
                <option value={""} selected disabled>
                  Select a Package to Book
                </option>

                {packageList?.map((item) => (
                  <option value={item?.id}>{item?.title}</option>
                ))}
              </select>
              <a href={packageID ? MainSiteUrl : ""} target="__blank">
                <button
                  className="btnNl btnNl-primary"
                  disabled={packageID ? false : true}
                >
                  Book Now
                </button>
              </a>
            </div>
            {/* {props?.dateFilter && (
            <button className="btnNl btnNl-secondary ">
              <FaCalendarDays size={16} />
              &nbsp;&nbsp; Filter
            </button>
          )} */}
          </div>
        </div>
      )}

      <DataTable
        className="dataTable-custom"
        data={props?.data}
        columns={props?.columns}
        noHeader
        pagination
        subHeader
        defaultSortFieldId="id"
        defaultSortAsc={false}
      />
    </div>
  );
}

export default Index;
