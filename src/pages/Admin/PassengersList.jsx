import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { getBookings } from "src/api/bookingAPI";
import PassengerList from "src/components/Dashboard/Admin/PassengersList";
import BounceLoader from "react-spinners/BounceLoader";

function PassengersList() {
  const [bookingsData, setBookingsData] = useState([]);
  const [FilterbookingsData, setFilterBookingsData] = useState([]);
  console.log("🚀 ~ PassengersList ~ FilterbookingsData:", FilterbookingsData);
  const [loading, setLoading] = useState(true);
  const [dateValue, setDateValue] = useState("");
  // Fetch Booking Slots data from the API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await getBookings();
      let today = new Date();
      let filteredBookings = data?.bookings
        ?.filter((item) => {
          let newDate = new Date(item?.booking_date);
          if (today.getTime() > newDate.getTime()) {
            return null;
          } else if (item?.booking_date == "0000-00-00") {
            return null;
          } else {
            return item;
          }
        })
        .sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));
      setBookingsData(filteredBookings);
      setFilterBookingsData(filteredBookings);
    } catch (err) {
      console.error("Failed to fetch booking slots.", err);
      toast.error("Failed to fetch booking slots.");
    } finally {
      setLoading(false);
    }
  };
  const handleDateChange = (e) => {
    let value = e.target.value;
    setDateValue(value);
    let filteredData = bookingsData?.filter(
      (item) => item?.booking_date == value
    );
    setFilterBookingsData(filteredData);
  };
  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div>
      <div className="Date_Filter" style={{ maxWidth: "200px" }}>
        Filter by Date:
        <div
          style={{
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <input
            className="inputField"
            type="date"
            onChange={handleDateChange}
            value={dateValue}
          />
          <button
            className="btnNl btnNl-primary"
            disabled={dateValue ? false : true}
            onClick={() => {
              setDateValue("");
              setFilterBookingsData(bookingsData);
            }}
            style={{
              borderRadius: "12px",
              padding: "8px 12px",
              height: "max-content",
            }}
          >
            Reset
          </button>
        </div>
      </div>
      {loading ? (
        <Row className="mt-40 gy-5 gx-lg-5 gx-md-5">
          <Col md={12} lg={12}>
            <div
              style={{
                height: "80vh",
                width: " 100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <BounceLoader color={"#7ab342"} size={60} />
            </div>
          </Col>
        </Row>
      ) : (
        <Row className="mt-40 gy-5 gx-lg-5 gx-md-5">
          {FilterbookingsData?.map((item) => (
            <Col key={item.id} md={12} lg={12}>
              <PassengerList {...item} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}

export default PassengersList;
