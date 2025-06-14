import React, { useState, useEffect } from "react";
import DataTableComp from "src/components/TableComp/Index";
import { Badge, Button, Modal } from "react-bootstrap"; // Import Modal and Button
import { getBookings } from "src/api/bookingAPI";
import { FaUsers } from "react-icons/fa";
import { FaChildren } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import "./styels.scss";
import moment from "moment";

function Index() {
  const [bookingsData, setBookingsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false); // Modal state
  const [selectedBooking, setSelectedBooking] = useState(null); // To hold booking details for modal

  // Fetch Booking Slots data from the API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await getBookings();
      setBookingsData(data?.bookings);
    } catch (err) {
      console.error("Failed to fetch booking slots.", err);
      setError("Failed to fetch booking slots.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredData(bookingsData);
    } else {
      const filtered = bookingsData.filter(
        (booking) => booking?.bookingfrom === activeTab
      );
      setFilteredData(filtered);
    }
  }, [activeTab, bookingsData]);

  // Function to handle View button click
  const handleViewClick = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true); // Show the modal when view is clicked
  };

  // Close modal function
  const handleClose = () => setShowModal(false);

  const [openTab, setOpenTab] = useState("all");

  let columns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.id}</div>,
      maxWidth: "50px",
      id: "id",
    },

    {
      name: "Package Type",
      sortable: false,
      minWidth: "350px",
      cell: (row) => (
        <div className="d-flex justify-content-start align-items-center">
          <img src={row?.tour?.package_image} height={80} width={80} />
          <div className="Table_Package Table_Item">{row?.tour?.title}</div>
        </div>
      ),
    },

    {
      name: "Booking Date",
      selector: (row) => row?.slot?.date,
      sortable: true,
      minWidth: "160px",
      cell: (row) => <div className="Table_Item">{row?.slot?.date}</div>,
    },
    {
      name: "Trans Date",
      selector: (row) => row?.slot?.date,
      sortable: true,
      minWidth: "140px",
      cell: (row) => (
        <div className="Table_Item">
          {moment(row?.createdAt).format("YYYY-MM-DD")}
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
      name: "Order Code",
      selector: (row) => row?.order_short_code,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.order_short_code}</div>,
      minWidth: "140px",
    },
    {
      name: "Order ID",
      selector: (row) => row?.order_id,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.order_id}</div>,
      minWidth: "120px",
    },
    {
      name: "Status",
      selector: (row) => row?.status,
      sortable: true,
      cell: (row) => (
        <div className="Table_Item">
          <Badge
            pill
            bg={
              row?.status === "completed"
                ? "success"
                : row?.status === "pending"
                ? "warning"
                : row?.status === "approved"
                ? "info"
                : "danger"
            }
            className="text-capitalize"
          >
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
  ];

  let Tabs = [
    { title: "All", key: "all" },
    { title: "B2B Company", key: "B2B-company" },
  ];

  return (
    <div className="BookingTbld93L mt-40">
      <DataTableComp
        data={filteredData}
        columns={columns}
        tabs={Tabs}
        dateFilter={true}
        title="Upcoming Bookings"
        setActiveTab={setActiveTab}
        openTab={openTab}
        setOpenTab={setOpenTab}
        showBookingOption={false}
      />
      {/* Modal for showing booking details */}
      <Modal show={showModal} onHide={handleClose} centered>
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
                {selectedBooking.slot?.tour?.title}
              </h5>
              <hr />
              <h6 className="text-secondary">Contact Details:</h6>
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
                <strong>Adult Booked:</strong> {selectedBooking?.slot_adult}
              </p>{" "}
              <p>
                <FaChildren size={16} /> <strong>Child Booked:</strong>{" "}
                {selectedBooking?.slot_child}
              </p>
              <p>
                <FaBookmark size={16} />
                &nbsp;
                <strong> Total Booked:</strong> {selectedBooking?.slot_count}
              </p>
              <p>
                <FaCircleInfo size={16} />
                <strong>Slots Status:</strong>{" "}
                {selectedBooking?.slot_conformation}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <i className="bi bi-x-circle"></i> Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Index;
