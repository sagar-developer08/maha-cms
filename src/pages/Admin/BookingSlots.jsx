import React, { useEffect, useState } from "react";
import SlotCard from "src/components/Dashboard/Admin/SlotBooking/SlotList";
import TopBar from "src/components/Dashboard/Admin/SlotBooking/TopBar";
import { Col, Row } from "react-bootstrap";
// api
import { getSlot } from "src/api/slotsAPI";

function BookingSlots() {
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Booking Slots data from the API
  const fetchBookingSlots = async () => {
    try {
      setLoading(true);
      const { data } = await getSlot();
      setCardData(data?.slots);
    } catch (err) {
      console.error("Failed to fetch booking slots.", err);
      setError("Failed to fetch booking slots.", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBookingSlots();
  }, []);

  // Render loading state
  if (loading) return <div>Loading...</div>;

  // Render error state
  if (error) return <div>{error}</div>;

  return (
    <div>
      <TopBar />
      <Row className="mt-40 gy-5 gx-lg-5 gx-md-5">
        {cardData?.map((item) => (
          <Col key={item.id} md={6} lg={4}>
            <SlotCard
              id={item.id}
              date={item.date}
              time={item.time}
              duration={item.duration}
              totalSlots={item.totalSlots}
              bookedSlots={item.bookedSlots}
              fetchSlots={fetchBookingSlots}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default BookingSlots;
