import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import TopNav from "src/components/Admin/MyAccount/TabBar/Index";
import ProfileForm from "src/components/Admin/MyAccount/ProfileForm";
import ChangePasswordForm from "src/components/Admin/MyAccount/ChangePasspword";
import UsersList from "src/components/Admin/Users/List";
import WalletCard from "src/components/Cards/Wallet/Index";
import WalletTableList from "src/components/Customer/MyWallet/TableList";

function MyAccount() {
  const [openTab, setOpenTab] = useState(1);

  return (
    <div>
      <TopNav openTab={openTab} setOpenTab={setOpenTab} />
      {openTab == 2 ? (
        <Row className="mt-40">
          <Col md={12}>
            <UsersList />
          </Col>
        </Row>
      ) : (
        <Row>
          <Col md={8}>
            <ProfileForm />
          </Col>
          <Col md={4}>
            <ChangePasswordForm />
          </Col>
        </Row>
      )}
    </div>
  );
}

export default MyAccount;
