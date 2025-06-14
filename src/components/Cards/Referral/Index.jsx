import React from "react";
import avatar1 from "src/assets/avatar/avatar.png";
import avatar2 from "src/assets/avatar/avatar2.png";
import avatar3 from "src/assets/avatar/avatar3.png";
import { MdContentCopy } from "react-icons/md";
import "./styles.scss";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Col, Row } from "react-bootstrap";

function Index(props) {
  const userData = useSelector((state) => state.auth.userData);

  return (
    <div className="Referral39d9">
      <div className="cardP">
        <div className="profile">
          <div className="avatarsList">
            <img
              className=""
              src={avatar1}
              alt="avatar"
              height={40}
              width={40}
            />
            <img
              className="mgt"
              src={avatar2}
              alt="avatar"
              height={40}
              width={40}
            />
            <img
              className="mgt"
              src={avatar3}
              alt="avatar"
              height={40}
              width={40}
            />
          </div>
          <div className="title">My Referral Center</div>
        </div>
        <div className="ReferalLInks">
          <div>
            <div className="detail">
              <div className="Name">SignUp Link</div>
              <div
                className="booking mt-1"
                onClick={() => {
                  if (!userData?.referral_code) {
                    toast.info("No Referal Link create yet", {
                      autoClose: 1000,
                      hideProgressBar: true,
                    });
                    return;
                  }
                  navigator.clipboard.writeText(
                    `${import.meta.env.VITE_referalLink}${
                      userData?.referral_code
                    }`
                  );
                  toast.info("Referral Code Copied", {
                    autoClose: 1000,
                    hideProgressBar: true,
                  });
                }}
              >
                /{userData?.referral_code}
                <MdContentCopy size={24} />
              </div>
            </div>
          </div>
          <div>
            <div className="detail">
              <div className="Name">Booking Link</div>
              <div
                className="booking justify-content-end mt-1"
                onClick={() => {
                  if (!userData?.referral_code) {
                    toast.info("No Referal Link create yet", {
                      autoClose: 1000,
                      hideProgressBar: true,
                    });
                    return;
                  }
                  navigator.clipboard.writeText(
                    `${import.meta.env.VITE_BookingreferalLink}${
                      userData?.referral_code
                    }`
                  );
                  toast.info("Referral Code Copied", {
                    autoClose: 1000,
                    hideProgressBar: true,
                  });
                }}
              >
                /{userData?.referral_code}
                <MdContentCopy size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
