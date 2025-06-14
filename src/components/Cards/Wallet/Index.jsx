import React, { useEffect, useState } from "react";
import coin from "src/assets/icons/GiftCoin.svg";

import "./styles.scss";

function Index(props) {
  const { walletMain } = props;
  return (
    <>
      <div className="walletCardk32">
        {" "}
        <div className="giftCard">
          <div className="d-flex justify-content-between align-items-center">
            <img src={coin} alt="" height={80} width={80} />
            <div className="sec-title">Total Comission</div>
          </div>
          <div className="Price">
            AED{" "}
            {props?.amount?.totalCommission
              ? parseInt(props?.amount?.totalCommission)?.toFixed(2)
              : 0}
          </div>
        </div>
      </div>
      {walletMain ? (
        <>
          <div className="walletCardk32">
            {" "}
            <div className="giftCard">
              <div className="d-flex justify-content-between align-items-center">
                <img src={coin} alt="" height={80} width={80} />
                <div className="sec-title">Total Withdrawals</div>
              </div>
              <div className="Price">
                AED{" "}
                {props?.amount?.totalWithdrawals
                  ? parseInt(props?.amount?.totalWithdrawals)?.toFixed(2)
                  : 0}
              </div>
            </div>
          </div>
          <div className="walletCardk32">
            {" "}
            <div className="giftCard">
              <div className="d-flex justify-content-between align-items-center">
                <img src={coin} alt="" height={80} width={80} />
                <div className="sec-title">Available Commission</div>
              </div>
              <div className="Price">
                AED{" "}
                {props?.amount?.availableCommission
                  ? parseInt(props?.amount?.availableCommission)?.toFixed(2)
                  : 0}
              </div>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Index;
