import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import WalletCard from "src/components/Cards/Wallet/Index";
import ProfileCard from "src/components/Cards/Profile";
import ReferralCard from "src/components/Cards/Referral";
import BookingList from "src/components/Dashboard/Customer/Dashboard/BookingList/Index";
import { useDispatch, useSelector } from "react-redux";
import commonApi from "src/api/commonApi";
import { getCommission } from "src/api/referenceAPI";
import { toast } from "react-toastify";
import { UpdateUser } from "src/store/auth";
function DashboardCustomer() {
  let [commissiondata, setcommissiondata] = useState(null);
  const userData = useSelector((state) => state.auth.userData);
  const [bookingsList, setBookingsList] = useState([]);

  const { getOneUser } = commonApi();
  const dispatch = useDispatch();
  const getSingleUser = async () => {
    const response = await getOneUser(userData?.id);
    if (response?.status == 200) {
      let UpatedData = { ...response?.data };
      delete UpatedData.password;
      dispatch(UpdateUser(UpatedData));
    } else {
      toast.error(
        response?.data?.error || "Something Went Wrong Please Try again later",
        {
          toastId: "UserDataError",
        }
      );
    }
  };
  useEffect(() => {
    if (userData?.id) {
      getSingleUser();
    }
    getwallet();
  }, [userData?.id]);

  // commission

  const getwallet = async () => {
    try {
      const response = await getCommission(userData?.id);
      setcommissiondata(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Row className="gy-3">
        {commissiondata ? (
          <Col md={4}>
            <WalletCard amount={commissiondata} />
          </Col>
        ) : (
          <p>Loading...</p>
        )}
        <Col md={4}>
          <ProfileCard bookingsList={bookingsList} userData={userData} />
        </Col>
        <Col md={4}>
          <ReferralCard userData={userData} />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <BookingList setBookingsList={setBookingsList} />
        </Col>
      </Row>
      {/* <Row className="gy-3">
        {commissiondata && commissiondata.totalSales && commissiondata.breakdown ? (
          <Row>
            <Col md={6}>
              <h3>Direct Sales: ${commissiondata.totalSales.directSales}</h3>
              <h3>L1 Sales: ${commissiondata.totalSales.level1Sales}</h3>
              <h3>L2 Sales: ${commissiondata.totalSales.level2Sales}</h3>
            </Col>
            <Col md={6}>
              <h3>Direct Commission: ${commissiondata.breakdown.directCommission}</h3>
              <h3>L1 Commission: ${commissiondata.breakdown.l1Commission}</h3>
              <h3>L2 Commission: ${commissiondata.breakdown.l2Commission}</h3>
            </Col>
          </Row>
        ) : (
          <p>Loading data...</p> // Optionally show a loading state or nothing
        )}
      </Row> */}
    </div>
  );
}

export default DashboardCustomer;
