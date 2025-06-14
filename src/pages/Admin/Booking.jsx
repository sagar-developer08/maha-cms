import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import GenCard from "src/components/Cards/GenInfo";
import { FaCalendarDays } from "react-icons/fa6";
import BookingListComp from "src/components/Dashboard/Admin/BookingList";
// api
import { getBookings } from "src/api/bookingAPI";

function Booking() {
  const [bookingsData, setBookingsData] = useState([]);
  const [loading, setLoading] = useState(true);
  // Fetch Booking Slots data from the API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await getBookings();
      setBookingsData(data?.bookings);
    } catch (err) {
      console.error("Failed to fetch booking slots.", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div>
      <Row>
        <Col md={3}>
          <GenCard
            icon={<FaCalendarDays size={30} />}
            title={"Total Bookings"}
            info={bookingsData?.length}
            loading={loading}
          />
        </Col>
        <Col xs={12}>
          <BookingListComp />
        </Col>
      </Row>
    </div>
  );
}

export default Booking;
