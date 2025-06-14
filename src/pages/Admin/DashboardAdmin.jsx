import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import GenCard from "src/components/Cards/GenInfo";
import { IoWallet } from "react-icons/io5";
import { FaUserGroup } from "react-icons/fa6";
import { FaCalendarDays } from "react-icons/fa6";
import BookingListComp from "src/components/Dashboard/Admin/Dashboard/BookingList/Index";
import commonApi from "src/api/commonApi";
import { getBookings } from "src/api/bookingAPI";

function DashboardAdmin() {
  const [dashInfo, setDashInfo] = useState({
    earning: "",
    booking: "",
    clients: "",
  });
  const { getUsersList } = commonApi();

  const getDashData = async () => {
    const userResp = await getUsersList();
    if (userResp?.status == 200) {
      setDashInfo((prev) => ({
        ...prev,
        clients: userResp?.data?.length,
      }));
    }
  };
  useEffect(() => {
    getDashData();
  }, []);

  const fetchBookings = async () => {
    try {
      const bookingResp = await getBookings();
      if (bookingResp?.status == 200) {
        setDashInfo((prev) => ({
          ...prev,
          booking: bookingResp?.data?.bookings?.length,
          earning: bookingResp?.data?.bookings.reduce(
            (accumulator, currentValue) => {
              return currentValue?.subTotal
                ? accumulator + currentValue?.subTotal
                : accumulator + 0;
            },
            0
          ),
        }));
      }
    } catch (err) {
      console.error("Failed to fetch booking slots.", err);
    }
  };
  useEffect(() => {
    fetchBookings();
  }, []);
  return (
    <div>
      <Row className="gy-3">
        <Col md={3}>
          <GenCard
            icon={<IoWallet size={30} />}
            title={"Total Earnings"}
            info={`AED ${new Intl.NumberFormat({
              style: "currency",
              currency: "AED",
            }).format(dashInfo?.earning)}`}
          />
        </Col>
        <Col md={3}>
          <GenCard
            icon={<FaCalendarDays size={30} />}
            title={"Total Bookings"}
            info={`${dashInfo?.booking}`}
          />
        </Col>
        <Col md={3}>
          <GenCard
            icon={<FaUserGroup size={30} />}
            title={"Total Clients"}
            info={`${dashInfo?.clients}`}
          />
        </Col>
        <Col xs={12}>
          <BookingListComp />
        </Col>
      </Row>
    </div>
  );
}

export default DashboardAdmin;
