import React from "react";
import BounceLoader from "react-spinners/BounceLoader";

const Index = () => {
  return (
    <>
      <div
        className={`d-flex align-items-center justify-content-center`}
        style={{
          position: "absolute",
          zIndex: 99999,
          height: "100%",
          width: "100%",
          background: "rgba(255, 255, 255, 1)",
        }}
      >
        <BounceLoader color={"#7ab342"} size={60} />
      </div>
    </>
  );
};
export default Index;
