import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// css
import "./styles.scss";
import { deletePackage } from "src/api/packagesAPI";

function Card(props) {
  const { id, img, title, price, featured, duration, location } = props;
  const { lang = "en" } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsloadng] = useState(false);

  const handleDelete = async (id) => {
    try {
      setIsloadng(true);
      const response = await deletePackage(id);
      toast.success("Package Deleted Successfully!");
      props.fetchPackages();
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
        <div className="imageWrapper">
          <img src={img} alt={title || "Package Image"} />
          {featured && <div className="featured">Featured</div>}
        </div>
        <div className="price mt-3">
          <div className="title">{title}</div>
          <div className="amount">From AED {price}</div>
        </div>
        <div className="time mt-3">
          <p className="para bds">Time</p>
          <p className="para">{duration || "45 - 60 Minutes"}</p>
        </div>
        <div className="location mt-3">
          <p className="para bds">Location</p>
          <p className="para">
            {location || "Margham Dubai, United Arab Emirates"}
          </p>
        </div>
        <div className="">
          <button
            className="btnNl btnNl-primary pds mt-1 mrs"
            onClick={() => {
              navigate(`/${lang}/admin/package/edit/${id}`);
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
