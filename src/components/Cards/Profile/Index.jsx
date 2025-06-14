import React from "react";
import avatar from "src/assets/avatar/avatar.png";
import "./styles.scss";
function Index(props) {
  const { bookingsList } = props;
  return (
    <div className="Proifle39d">
      <div className="cardP">
        <div className="profile">
          <img src={avatar} alt="avatar" height={60} width={60} />
          <div className="title">My Profile</div>
        </div>
        <div className="detail">
          <div className="Name">
            {props?.userData?.first_name} {props?.userData?.last_name}
          </div>
          <div className="booking">
            {bookingsList ? bookingsList + " Bookings" : "None"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
