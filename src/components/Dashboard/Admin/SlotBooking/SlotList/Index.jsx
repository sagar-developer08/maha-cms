import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// css
import "./styles.scss";
import { deleteSlot } from "src/api/slotsAPI";

function Card(props) {
  const { id, date, time, duration, totalSlots, bookedSlots } = props;
  const { lang = "en" } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsloadng] = useState(false);

  const handleDelete = async (id) => {
    try {
      setIsloadng(true);
      const response = await deleteSlot(id);
      toast.success("Booking Slot Deleted Successfully!");
      props.fetchSlots();
    } catch (err) {
      setIsloadng(false);
      console.error(err);
    } finally {
      setIsloadng(false);
    }
  };

  return (
    <div className={`PackageCard93kd09`}>
      <div className="cardFlight">
        <div className="time d-flex justify-content-between align-items-center">
          <p className="para bds">Booking Slot</p>
          <p className="para">{date}</p>
        </div>
        <div className="time mt-2 d-flex justify-content-between align-items-center">
          <p className="para bds">Duration</p>
          <p className="para">{duration}</p>
        </div>
        <div className="time mt-2 d-flex justify-content-between align-items-center">
          <p className="para bds">Total Slots</p>
          <p className="para">{totalSlots}</p>
        </div>
        <div className="time mt-2 d-flex justify-content-between align-items-center">
          <p className="para bds">Booked Slots</p>
          <p className="para">{bookedSlots}</p>
        </div>
        <div className="">
          <button
            className="btnNl btnNl-primary pds mt-1 mrs"
            onClick={() => {
              navigate(`/${lang}/admin/booking-slots/edit/${id}`);
            }}
          >
            View
          </button>
          <button
            className="btnNl btnNl-secondary mt-1 pds"
            onClick={() => handleDelete(id)}
            disabled={isLoading && true}
          >
            {isLoading ? "Deleting..." : " Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Card;
