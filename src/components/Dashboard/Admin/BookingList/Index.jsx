import React, { useState, useEffect } from "react";
import DataTableComp from "src/components/TableComp/Index";
import { Button, Modal } from "react-bootstrap"; // Import Modal and Button

import imgThumb from "src/assets/thumb.png";
import { Badge } from "react-bootstrap";
import { FaTrash } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaChildren } from "react-icons/fa6";
import { FaBookmark } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";

// api
import {
  deleterBooking,
  getBookings,
  updatedBooking,
} from "src/api/bookingAPI";
// css
import "./styels.scss";
import { toast } from "react-toastify";
import moment from "moment";

function Index() {
  const [bookingsData, setBookingsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [bookingStatus, setBookingStatus] = useState("");
  const [showModal, setShowModal] = useState(false); // Modal state
  const [bookingId, setbookingID] = useState(null);
  const [isStatusUpdating, setIsStatusUpdating] = useState(false);
  const [showModalPassenger, setshowModalPassenger] = useState(false); // Modal state
  const [selectedBooking, setSelectedBooking] = useState(null); // To hold booking details for modal

  const handleClose = () => {
    setShowModal(false);
    setbookingID(null);
    setBookingStatus("");
  };

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

  const handleDelete = async (id) => {
    if (confirm("Once Deleted, Booking Cant be recovered!") == true) {
      try {
        const res = await deleterBooking(id);
      } catch (err) {
        console.log("Booking Delete Error: ", err);
      } finally {
        await fetchBookings();
        toast.success("Removed Successfully");
      }
      return;
    }
  };
  const updateBookingStatus = async () => {
    if (!bookingId) {
      return;
    }
    setIsStatusUpdating(true);

    let UpdatedData = { status: bookingStatus };
    try {
      const res = await updatedBooking(UpdatedData, bookingId);
    } catch (err) {
      console.log("Booking Update Error: ", err);
      setIsStatusUpdating(false);
    } finally {
      await fetchBookings();
      toast.success("Booking Status Updated Successfully");
      setIsStatusUpdating(false);
      handleClose();
    }
    return;
  };

  const approveB2bBookingStatus = async (bookingId) => {
    if (!bookingId) {
      return;
    }
    setIsStatusUpdating(true);

    let UpdatedData = { status: "completed" };
    try {
      const res = await updatedBooking(UpdatedData, bookingId);
    } catch (err) {
      console.log("Booking Update Error: ", err);
    } finally {
      await fetchBookings();
      toast.success("Booking Status Updated Successfully");
    }
    return;
  };

  const [openTab, setOpenTab] = useState("all");

  let columns = [
    {
      name: "Action",
      minWidth: "120px",
      cell: (row) => (
        <div className="Table_Item d-flex justify-content-start">
          <div
            className="actionIcon"
            onClick={() => {
              handleDelete(row?.id);
            }}
          >
            <FaTrash className="icon_trash" size={20} />
          </div>
          {row?.bookingfrom === activeTab ? (
            <></>
          ) : (
            <div
              className="actionIcon mx-3"
              onClick={() => {
                setbookingID(row.id);
                setShowModal(true);
              }}
            >
              <FaEdit className="icon_edit" size={20} />
            </div>
          )}

          {row?.bookingfrom === activeTab && (
            <div
              className="actionIcon mx-3"
              onClick={() => {
                if (row?.status == "pending") {
                  approveB2bBookingStatus(row.id);
                }
              }}
            >
              <Badge
                pill
                bg={row?.status === "pending" ? "danger" : "success"}
                className="text-capitalize"
              >
                {row?.status === "pending" ? "Approve Booking" : "Approved"}
              </Badge>
            </div>
          )}
        </div>
      ),
    },
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
      selector: (row) => row?.id,
      sortable: true,
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
      selector: (row) => row?.id,
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
    <>
      <div className="BookingTbld93L  mt-40">
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
      </div>
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Booking Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-start align-items-center">
            <select
              className="selectOption"
              name="bookingStatus"
              id=""
              onChange={(e) => {
                setBookingStatus(e.target.value);
              }}
            >
              <option value="" selected disabled>
                Select Status
              </option>
              <option value="pending">Pending</option>
              <option value={"completed"}>Completed</option>
              <option value={"cancelled"}>Cancelled</option>
            </select>
            <Button
              className="mx-3 "
              variant="success"
              onClick={updateBookingStatus}
              disabled={isStatusUpdating}
            >
              {isStatusUpdating ? "Updating..." : "Update"}
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            <i className="bi bi-x-circle"></i> Close
          </Button>
        </Modal.Footer>
      </Modal>

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
                {selectedBooking.slot?.tour?.title}
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
                <strong>Adult Booked:</strong> {selectedBooking?.slot_adult}
              </p>{" "}
              <p>
                <FaChildren size={16} /> <strong>Child Booked:</strong>{" "}
                {selectedBooking?.slot_child}
              </p>
              <p>
                <FaBookmark size={16} />
                <strong>Total Booked:</strong> {selectedBooking?.slot_count}
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
          <Button variant="secondary" onClick={handlePassengerClose}>
            <i className="bi bi-x-circle"></i> Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Index;
