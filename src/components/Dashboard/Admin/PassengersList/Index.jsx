import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// css
import "./styles.scss";
import { deleteSlot } from "src/api/slotsAPI";
import { Button, Col, Modal, Row } from "react-bootstrap";
import DataTableComp from "src/components/TableComp/Index";

function Card(props) {
  const {
    id,
    booking_date,
    order_id,
    order_short_code,
    booking_id,
    slot_adult,
    slot_child,
    slot_count,
    payment_status,
    passengers,
  } = props;
  console.log("🚀 ~ Card ~ passengers:", passengers);
  const { lang = "en" } = useParams();
  const navigate = useNavigate();
  const [passengerList, setPassengerList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleShowPassenger = () => {
    setShowModal(true);
  };

  const handleHidePassenger = () => {
    setShowModal(false);
  };

  const [openTab, setOpenTab] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

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
      name: "Booking ID",
      sortable: false,
      cell: (row) => <div className="Table_Item">{id}</div>,
    },
    {
      name: "Email",
      selector: (row) => row?.email,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.email}</div>,
      minWidth: "50px",
    },
    {
      name: "Full Name",
      selector: (row) => row?.name,
      sortable: true,
      cell: (row) => (
        <div className="Table_Item">
          {row?.name} {row?.last_name}{" "}
        </div>
      ),
      minWidth: "50px",
    },
    {
      name: "Phone",
      selector: (row) => row?.phone,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.phone}</div>,
      minWidth: "50px",
    },
    {
      name: "Phone",
      selector: (row) => row?.phone,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.phone}</div>,
      minWidth: "50px",
    },
    {
      name: "Type",
      selector: (row) => row?.type,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.type}</div>,
      minWidth: "50px",
    },
    {
      name: "Weight in KG",
      selector: (row) => row?.type,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.weight}</div>,
      minWidth: "50px",
    },
  ];

  let Tabs = [{ title: "All", key: "all" }];
  return (
    <>
      <div className={`PassengersList32kd09`}>
        <div className="cardFlight3">
          <Row>
            <Col xs={12} md={4}>
              <div className="time d-flex justify-content-start align-items-center ">
                <p className="para bds ">Booking Date:</p>
                <p className="para dateList2">{booking_date}</p>
              </div>
            </Col>{" "}
            <Col xs={12} md={4}>
              <div className="time mt-2 d-flex justify-content-start align-items-center">
                <p className="para bds">Order Short Code: </p>
                <p className="para">{order_short_code}</p>
              </div>
            </Col>
            <Col xs={12} md={4}>
              <div className="time mt-2 d-flex justify-content-start align-items-center">
                <p className="para bds">Child </p>
                <p className="para">{slot_child}</p>
                <p className="para bds"> </p>
                <p className="para bds">Adults </p>
                <p className="para">{slot_adult}</p>
              </div>
            </Col>
            <Col>
              <div className="passengersListContainer">
                <h5 className="ptr-sec">Booked By:</h5>
                <Row>
                  {passengers?.slice(0, 1)?.map((passenger, index) => (
                    <>
                      <Col>
                        <p>
                          <i className="bi bi-person-fill"></i>{" "}
                          <strong>Name:</strong> {passenger.name}{" "}
                          {passenger.last_name}
                        </p>
                      </Col>
                      <Col>
                        <p>
                          <i className="bi bi-envelope-fill"></i>{" "}
                          <strong>Email:</strong> {passenger.email}
                        </p>
                      </Col>
                      <Col>
                        <p>
                          <i className="bi bi-telephone-fill"></i>{" "}
                          <strong>Phone:</strong> {passenger.phone}
                        </p>
                      </Col>
                    </>
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <DataTableComp
              data={passengers}
              columns={columns}
              tabs={Tabs}
              dateFilter={true}
              title="All Passengers"
              setActiveTab={setActiveTab}
              openTab={openTab}
              setOpenTab={setOpenTab}
              showBookingOption={false}
              showTabs={false}
            />
            {/* {passengers?.map((passenger, index) => (
            
            ))} */}
          </Row>

          {/* <div className="d-flex justify-content-center">
            <button
              className="btnNl btnNl-primary disabledStyle"
              onClick={() => {
                setPassengerList(passengers?.slice(1, passengers?.length));
                handleShowPassenger();
              }}
              disabled={
                passengers?.slice(1, passengers?.length)?.length <= 0
                  ? true
                  : false
              }
            >
              {passengers?.slice(1, passengers?.length)?.length <= 0
                ? "No Passengers"
                : "View Passengers"}
            </button>
          </div> */}
        </div>
      </div>

      <Modal show={showModal} onHide={handleHidePassenger} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-primary">
            {" "}
            <h5 className="ptr-sec">Passengers List:</h5>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            {" "}
            {passengerList?.map((passenger, index) => (
              <Col xs={12} md={6}>
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
                  <p>
                    <i className="bi bi-person-fill"></i> <strong>Type:</strong>{" "}
                    {passenger.type}
                  </p>
                  {passenger?.weight && (
                    <p>
                      <i className="bi bi-bar-chart-fill"></i>{" "}
                      <strong>Weight:</strong> {passenger.weight} kg
                    </p>
                  )}
                  <hr
                    style={{
                      width: "50%",
                      margin: "5px auto",
                    }}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleHidePassenger}>
            <i className="bi bi-x-circle"></i> Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Card;
