import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopEditbar from "./TopBar/Index";
import { Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
// api
import {
  getSingleSlot,
  postSlot,
  updateSlot,
} from "../../../../../api/slotsAPI";
// css
import "./styles.scss";

const initObj = {
  date: "",
  endDate: "",
  time: "11:00",
  totalSlots: "",
  duration: "",
  bookedSlots: 0,
  packageId: 2,
  flightId: 1,
};

function Index() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ ...initObj });
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsloadng] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  single Slot Data
  const fetchSingleSlotData = async () => {
    try {
      setLoading(true);
      const { data } = await getSingleSlot(id);
      setFormData(data);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching Data:", error);
      setError("Failed to fetch booking slots.", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    if (id) {
      setIsEdit(true);
      fetchSingleSlotData();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    // const updatedData = { ...formData };
    const updatedData = {
      startDate: formData.date,
      endDate: formData.endDate,
      totalSlots: formData.totalSlots,
      duration: formData.duration,
      time: formData.time,
      bookedSlots: 0,
      packageId: 2,
      flightId: 1,
    };
    const payload = structuredClone(updatedData);
    if (!payload.startDate) {
      toast.error("Add Booking Slot");
      return;
    } else if (!payload.time) {
      toast.error("Add Time");
      return;
    } else if (!payload.totalSlots) {
      toast.error("Add Total Slots");
      return;
    } else if (!payload.duration) {
      toast.error("Add Duration");
      return;
    }

    setIsloadng(true);
    if (isEdit) {
      try {
        const response = await updateSlot(id, payload);
        setIsloadng(false);
        if (response.status === 200 || response.status === 201) {
          toast.success("Booking slot has been Updated Successfully!");
          setFormData({ ...initObj });
          navigate("/en/admin/booking-slots");
        }
      } catch (error) {
        console.error("Error fetching Data:", error);
        setIsloadng(false);
        toast.error("Something Went wrong!");
      }
    } else {
      try {
        const response = await postSlot(updatedData);
        if (response.status === 200 || response.status === 201) {
          setIsloadng(false);
          toast.success("Booking Slot has been Added Successfully!");
          setFormData({ ...initObj });
          navigate("/en/admin/booking-slots");
        }
      } catch (error) {
        console.error("Error fetching Data:", error);
        setIsloadng(false);
        toast.error("Something Went wrong!");
      }
    }
  };

  const inputFields = [
    { name: "date", label: "Start Date Booking Slot", type: "date" },
    { name: "endDate", label: "End Date Booking Slot", type: "date" },
    // { name: "time", label: "Time", type: "time" },
    { name: "totalSlots", label: "Total Slots", type: "number" },
    { name: "duration", label: "Duration", type: "number" },
    // { name: "bookedSlots", label: "Booked Slots", type: "number" },
  ];

  // Render loading state
  if (loading) return <div>Loading...</div>;

  // Render error state
  if (error) return <div>{error}</div>;

  return (
    <div className="packageFormds39">
      <TopEditbar id={id} />
      <div className="FormWrapper mt-40">
        <div className="InputSec">
          <Row>
            {inputFields?.map((item, i) => (
              <Col xs={12} lg={6} key={item.name}>
                <div className="form_group mt-4">
                  <label htmlFor={item.name}>{item.label}</label>
                  <input
                    className="inputField"
                    name={item.name}
                    type={item.type}
                    value={formData[item.name]}
                    onChange={handleInputChange}
                  />
                </div>
              </Col>
            ))}
          </Row>
          <button
            className="btnNl btnNl-primary mt-4"
            onClick={handleSubmit}
            disabled={isLoading && true}
          >
            {isLoading ? "Submit..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Index;
