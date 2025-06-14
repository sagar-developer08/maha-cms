import React, { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import commonApi from "src/api/commonApi";
import "./styles.scss";
import { toast } from "react-toastify";
function Index() {
  const userData = useSelector((state) => state.auth.userData);
  const [currentPass, setCurrentPass] = useState(""); // For old password
  const [newPass, setNewPass] = useState(""); // For new password
  const [verifyPass, setVerifyPass] = useState(""); // For password verification
  const { UpdatePassword } = commonApi();

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

    try {
      const response = await UpdatePassword(userData?.id, formData); // Pass currentPass and newPass to the API
      console.log("🚀 ~ handleUpdatePassword ~ response:", response);
      if (response.status === 200) {
        toast.success("Password updated successfully");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong, please try again"
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
              <label htmlFor={"old_pass"}>Old Password</label>
              <input
                className="inputField"
                name={"old_pass"}
                type="password"
                placeholder=""
                onChange={(e) => setCurrentPass(e.target.value)}
              />
            </div>
          </Col>
          <Col xs={12}>
            <div className="form_group mt-4">
              <label htmlFor={"old_pass"}>New Password</label>
              <input
                className="inputField"
                name={"new_pass"}
                type="password"
                placeholder=""
                onChange={(e) => setNewPass(e.target.value)}
              />
            </div>
          </Col>
          <Col xs={12}>
            <div className="form_group mt-4">
              <label htmlFor={"old_pass"}>Verify Password</label>
              <input
                className="inputField"
                name={"verify_pass"}
                type="password"
                placeholder=""
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
