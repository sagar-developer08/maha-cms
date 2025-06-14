import React, { useState } from "react";
import "./styles.scss";
import { Col, Row } from "react-bootstrap";
import commonApi from "src/api/commonApi";
import { toast } from "react-toastify";

function Index() {
  const [currentPass, setCurrentPass] = useState(""); // For old password
  const [newPass, setNewPass] = useState(""); // For new password
  const [verifyPass, setVerifyPass] = useState(""); // For password verification
  const { UpdatePassword } = commonApi();

  // Fetch and parse persisted data from localStorage
  const persistedData = localStorage.getItem('persist:root');
  let token = null;
  let userId = null;

  if (persistedData) {
    const parsedData = JSON.parse(persistedData);
    const authData = parsedData.auth ? JSON.parse(parsedData.auth) : null;

    if (authData) {
      token = authData.token; // Extract token
      userId = authData.userData.id; // Extract user ID
    }
  }

  const handleUpdatePassword = async () => {
    if (!currentPass) {
      toast.error("Please enter your current password");
      return;
    }

    if (newPass !== verifyPass) {
      toast.error("New passwords do not match");
      return;
    }

    const formData = {
      currentPassword: currentPass, // Old password
      password: newPass, // New password
    };

    let header = {
      headers: {
        Authorization: `Bearer ${token}`, // Use token from authData
      },
    };

    try {
      const response = await UpdatePassword(userId, formData, header); // Pass currentPass and newPass to the API
      if (response.status === 200) {
        toast.success("Password updated successfully");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong, please try again"
      );
    }
  };

  return (
    <div className="ChangePassWorddkd9 mt-40">
      <div className="changePassWrapper">
        <Row>
          <Col xs={12}>
            <div className="title">Change Password</div>
          </Col>
          <Col xs={12}>
            <div className="form_group mt-4">
              <label htmlFor={"current_pass"}>Current Password</label>
              <input
                className="inputField"
                name={"current_pass"}
                type="password"
                placeholder=""
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)} // Handle current password input
              />
            </div>
          </Col>
          <Col xs={12}>
            <div className="form_group mt-4">
              <label htmlFor={"new_pass"}>New Password</label>
              <input
                className="inputField"
                name={"new_pass"}
                type="password"
                placeholder=""
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
            </div>
          </Col>
          <Col xs={12}>
            <div className="form_group mt-4">
              <label htmlFor={"verify_pass"}>Verify Password</label>
              <input
                className="inputField"
                name={"verify_pass"}
                type="password"
                placeholder=""
                value={verifyPass}
                onChange={(e) => setVerifyPass(e.target.value)}
              />
            </div>
          </Col>
          <Col xs={12}>
            <button
              className="btnNl btnNl-primary mt-4"
              onClick={handleUpdatePassword}
            >
              Update
            </button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Index;
