// import React, { useState } from "react";
// import { Col, Row } from "react-bootstrap";
// import TopNav from "src/components/Customer/MyAccount/TabBar/Index";
// import ProfileForm from "src/components/Customer/MyAccount/ProfileForm/Index";
// import ChangePasswordForm from "src/components/Customer/MyAccount/ChangePasspword";
// import WalletCard from "src/components/Cards/Wallet/Index";
// import WalletTableList from "src/components/Customer/MyWallet/TableList";
// import ReferralCard from "src/components/Cards/Referral";
// import ReferralsList from "src/components/Customer/MyReferrals/TableList";

// function MyAccount() {
//   const [openTab, setOpenTab] = useState(1);

//   return (
//     <div>
//       <TopNav openTab={openTab} setOpenTab={setOpenTab} />
//       {openTab == 2 ? (
//         <Row className="mt-40">
//           <Col md={4}>
//             <WalletCard amount={"Aed 200"} />
//           </Col>
//           <Col md={8}>
//             <WalletTableList />
//           </Col>
//         </Row>
//       ) : openTab == 3 ? (
//         <Row className="mt-40">
//           <Col md={4}>
//             <ReferralCard />
//           </Col>
//           <Col md={8}>
//             <ReferralsList />
//           </Col>
//         </Row>
//       ) : (
//         <Row>
//           <Col md={8}>
//             <ProfileForm />
//           </Col>
//           <Col md={4}>
//             <ChangePasswordForm />
//           </Col>
//         </Row>
//       )}
//     </div>
//   );
// }

// export default MyAccount;

import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import TopNav from "src/components/Customer/MyAccount/TabBar/Index";
import ProfileForm from "src/components/Customer/MyAccount/ProfileForm/Index";
import ChangePasswordForm from "src/components/Customer/MyAccount/ChangePasspword";
import WalletCard from "src/components/Cards/Wallet/Index";
import WalletTableList from "src/components/Customer/MyWallet/TableList";
import ReferralCard from "src/components/Cards/Referral";
import ReferralsList from "src/components/Customer/MyReferrals/TableList";
// import commonApi from "src/api/commonApi";
import { authData } from "src/TempUserDetails";
import { useDispatch, useSelector } from "react-redux";
import commonApi from "src/api/commonApi";
import { UpdateUser } from "src/store/auth";
import { getCommission } from "src/api/referenceAPI";
import { toast } from "react-toastify";

function MyAccount() {
  const [openTab, setOpenTab] = useState(1);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true); // Loading state

  // comission
  const userDataRdx = useSelector((state) => state.auth.userData);
  let [commissiondata, setcommissiondata] = useState(null);
  const { getOneUser } = commonApi();
  const dispatch = useDispatch();

  const getSingleUser = async () => {
    const response = await getOneUser(userDataRdx?.id);
    if (response?.status == 200) {
      let UpatedData = { ...response?.data };
      delete UpatedData.password;
      dispatch(UpdateUser(UpatedData));
    } else {
      toast.error(
        response?.data?.error || "Something Went Wrong Please Try again later",
        {
          toastId: "UserDataError",
        }
      );
    }
  };
  useEffect(() => {
    if (userDataRdx?.id) {
      getSingleUser();
    }
    getwallet();
  }, [userDataRdx?.id]);

  // commission
  const getwallet = async () => {
    try {
      const response = await getCommission(userDataRdx?.id);
      setcommissiondata(response.data);
    } catch (error) {
      console.log(error);
    }
  };
  // comission End
  useEffect(() => {
    const fetchData = () => {
      if (authData && authData.userData) {
        setUserData(authData.userData);
      }
      setLoading(false); // Set loading to false after userData is retrieved
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs once after the component mounts

  if (loading) {
    return <div>Loading...</div>; // Show loading message while fetching user data
  }

  return (
    <>
      <div>
        <TopNav openTab={openTab} setOpenTab={setOpenTab} />
        {openTab == 2 ? (
          <Row className="mt-40" id="wallet_2">
            <Col md={4}>
              <WalletCard walletMain amount={commissiondata} />
            </Col>
            <Col md={8}>
              <WalletTableList commissiondata={commissiondata} />
            </Col>
          </Row>
        ) : openTab == 3 ? (
          <Row className="mt-40" id="referal_2">
            <Col md={4}>
              <ReferralCard />
            </Col>
            <Col md={8}>
              <ReferralsList />
            </Col>
          </Row>
        ) : (
          <Row id="profile_1">
            <Col md={8}>
              <ProfileForm UserData={userData} />
            </Col>
            <Col md={4}>
              <ChangePasswordForm />
            </Col>
          </Row>
        )}
      </div>
    </>
  );
}

export default MyAccount;
