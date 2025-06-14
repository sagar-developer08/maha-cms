import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DataTableComp from "src/components/TableComp/Index";
import { Badge } from "react-bootstrap";
import { Button, Modal } from "react-bootstrap"; // Import Modal and Button

// api
import { allComission, getCustomerBookings } from "src/api/bookingAPI";
// css
import { FaBookmark, FaChildren, FaCircleInfo, FaUsers } from "react-icons/fa6";
import moment from "moment";
import "./styels.scss";

function Index(props) {
  const { setBookingsList } = props;
  const userId = useSelector((state) => state?.auth?.userData?.id);
  const [bookingsData, setBookingsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModalPassenger, setshowModalPassenger] = useState(false); // Modal state
  const [selectedBooking, setSelectedBooking] = useState(null); // To hold booking details for modal

  // Function to handle View button click
  const handleViewClick = (booking) => {
    setSelectedBooking(booking);
    setshowModalPassenger(true); // Show the modal when view is clicked
  };
  const handlePassengerClose = () => setshowModalPassenger(false);

  // Fetch Booking Slots data from the API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await getCustomerBookings(userId);
      setBookingsData(data?.data || []); // Ensure bookingsData is an array even if API returns undefined or null
    } catch (err) {
      console.error("Failed to fetch booking slots.", err);
      setError("Failed to fetch booking slots.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings to show only completed bookings
  useEffect(() => {
    const filtered = bookingsData.filter(
      (booking) => booking?.status === "completed"
    );
    setFilteredData(filtered);
    setBookingsList(filtered?.length);
  }, [bookingsData]);

  const [allComissionData, setAllComissionData] = useState([]); // To hold booking details for modal

  const fetchAllComission = async () => {
    try {
      const { data } = await allComission();
      setAllComissionData(data);
    } catch (err) {
      console.error("Failed to fetch Comission Data.", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllComission();
  }, []);

  let columns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.id}</div>,
      maxWidth: "50px",
    },
    {
      name: "Package Type",
      selector: (row) => row?.id,
      sortable: false,
      minWidth: "350px",
      cell: (row) => (
        <div className="d-flex justify-content-start align-items-center">
          <img
            src={row?.slotDetails?.packageDetails?.package_image}
            height={80}
            width={80}
          />
          <div className="Table_Package Table_Item">
            {row?.slotDetails?.packageDetails?.title}
          </div>
        </div>
      ),
    },
    {
      name: "Date",
      selector: (row) => row?.id,
      sortable: false,
      minWidth: "120px",
      cell: (row) => (
        <div className="Table_Item">
          {moment(row?.slotDetails?.date).format("MMM/DD/YYYY")}
        </div>
      ),
    },

    {
      name: "Passengers",
      sortable: false,
      minWidth: "150px",
      cell: (row) => (
        <Button
          className="btnNl btnNl-primary pds mt-1 mrs"
          onClick={() => handleViewClick(row)}
        >
          View
        </Button>
      ),
    },
    {
      name: "Slots Booked",
      selector: (row) => row?.slot_count,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.slot_count}</div>,
    },
    {
      name: "Status",
      selector: (row) => row?.status,
      sortable: true,
      cell: (row) => (
        <div className="Table_Item">
          <Badge pill bg="success" className="text-capitalize">
            {row?.status}
          </Badge>
        </div>
      ),
    },
    {
      name: "Price",
      selector: (row) => row?.subTotal,
      sortable: true,
      minWidth: "120px",
      cell: (row) => <div className="Table_Item">AED {row?.subTotal}</div>,
    },
    {
      name: "Direct Comissions",
      selector: (row) => row?.id,
      sortable: false,
      minWidth: "160px",
      cell: (row) => (
        <div className="Table_Item">
          {allComissionData
            ?.filter((item) => item?.bookingId == row?.id)
            ?.map((item) => {
              return (
                <>
                  <div className="d-flex justify-content-start">
                    <div className="priceComission">
                      {item?.directCommission} AED{" "}
                    </div>
                  </div>
                </>
              );
            })}
        </div>
      ),
    },

    {
      name: "Direct Sales",
      selector: (row) => row?.id,
      sortable: false,
      minWidth: "160px",
      cell: (row) => (
        <div className="Table_Item">
          {allComissionData
            ?.filter((item) => item?.bookingId == row?.id)
            ?.map((item) => {
              return (
                <>
                  <div className="d-flex justify-content-start">
                    <div className="priceComission">
                      {item?.directSales} AED
                    </div>
                  </div>
                </>
              );
            })}
        </div>
      ),
    },
    {
      name: "Total Comissions",
      selector: (row) => row?.id,
      sortable: false,
      minWidth: "160px",
      cell: (row) => (
        <div className="Table_Item">
          {allComissionData
            ?.filter((item) => item?.bookingId == row?.id)
            ?.map((item) => {
              return (
                <>
                  <div className="d-flex justify-content-start">
                    <div className="priceComission">
                      {item?.totalCommission} AED
                    </div>
                  </div>
                </>
              );
            })}
        </div>
      ),
    },
  ];
  {
    /*  */
  }

  return (
    <div className="BookingTbld93L mt-40">
      {loading ? (
        <div>Loading...</div>
      ) : (
        <DataTableComp
          data={filteredData}
          columns={columns}
          title="Completed Bookings"
        />
      )}

      {/* Modal for showing booking details */}
      <Modal show={showModalPassenger} onHide={handlePassengerClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">Booking Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooking && (
            <div
              style={{
                maxHeight: "450px",
                overflowY: "auto",
              }}
            >
              <h5 className="font-weight-bold mb-3">
                <i className="bi bi-calendar3"></i>{" "}
                {selectedBooking.order_short_code}
              </h5>
              <hr />
              <h6 className="text-secondary">Passengers:</h6>
              {selectedBooking.passengers?.map((passenger, index) => (
                <div key={index} className="mb-4">
                  <p>
                    <i className="bi bi-person-fill"></i> <strong>Name:</strong>{" "}
                    {passenger.name}
                  </p>
                  <p>
                    <i className="bi bi-person-fill"></i>{" "}
                    <strong>Last Name:</strong> {passenger.last_name}
                  </p>
                  <p>
                    <i className="bi bi-envelope-fill"></i>{" "}
                    <strong>Email:</strong> {passenger.email}
                  </p>
                  <p>
                    <i className="bi bi-telephone-fill"></i>{" "}
                    <strong>Phone:</strong> {passenger.phone}
                  </p>

                  {/* <p>
                    <i className="bi bi-bar-chart-fill"></i>{" "}
                    <strong>Weight:</strong> {passenger.weight} kg
                  </p> */}
                  {index !== selectedBooking.passengers.length - 1 && <hr />}
                </div>
              ))}
              <p>
                {" "}
                <FaUsers size={16} />
                <strong> Adult Booked:</strong> {selectedBooking?.slot_adult}
              </p>{" "}
              <p>
                <FaChildren size={16} /> <strong>Child Booked:</strong>{" "}
                {selectedBooking?.slot_child}
              </p>
              <p>
                <FaBookmark size={16} /> <strong>Total Booked:</strong>{" "}
                {selectedBooking?.slot_count}
              </p>
              <p>
                <FaCircleInfo size={16} />
                <strong> Slots Status:</strong>{" "}
                {selectedBooking?.slot_conformation}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handlePassengerClose}>
            <i className="bi bi-x-circle"></i> Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Index;
