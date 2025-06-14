import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import thumb from "src/assets/Auth/testimonial.jpg";
import { useNavigate } from "react-router-dom";

import "./styles.scss";
import { toast } from "react-toastify";
import useAuthApi from "src/api/useAuthApi";
import { useDispatch } from "react-redux";
function Index(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { PostRegister } = useAuthApi();

  // Register User
  let initData = {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    vrify_password: "",
    role: "",
  };

  const [RegisterformData, setRegisterFormData] = useState({ ...initData });
  const [isRegisterSending, setIsRegisterSending] = useState(false);

  const handleRegisterChange = (e) => {
    setRegisterFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    let UpdatedData = { ...RegisterformData };
    UpdatedData.role = "admin";

    setIsRegisterSending(true);

    //! validation
    if (!UpdatedData.first_name) {
      setIsRegisterSending(false);
      toast.error("Please Enter First Name");
      return;
    }
    if (!UpdatedData.last_name) {
      setIsRegisterSending(false);
      toast.error("Please Enter Last Name");
      return;
    }
    if (!UpdatedData.email) {
      setIsRegisterSending(false);
      toast.error("Please Enter Email Address");
      return;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(UpdatedData?.email)) {
      setIsRegisterSending(false);
      toast.error("Email is Invalid");
      return;
    }
    if (!UpdatedData.phone) {
      setIsRegisterSending(false);
      toast.error("Please Enter Phone No");
      return;
    }
    if (!UpdatedData.password) {
      setIsRegisterSending(false);
      toast.error("Please Enter A Valid Password");
      return;
    }
    if (UpdatedData.password !== UpdatedData?.vrify_password) {
      setIsRegisterSending(false);
      toast.error("Please Enter Matching Password");
      return;
    }

    const response = await PostRegister(UpdatedData);
    console.log("🚀 ~ handleSubmit ~ response:", response);

    if (response?.status == 200 || response?.status == 201) {
      toast.success("Registration Successfull, Please Login Now ");

      setRegisterFormData({ ...initData });
      setIsRegisterSending(false);
      navigate("/login");
    } else {
      setIsRegisterSending(false);
      toast.error("Something Went Wrong");
    }
  };

  return (
    <div className="RegisterCustomer32">
      <Container>
        <Row className="gy-3">
          <Col lg={6}>
            <div className="formWrapper">
              <div className="form-title">
                Welcome to Maha Balloon Dashboard
              </div>
              <p className="form-details mt-2">Please Fill in your details</p>
              <div className="ReGisterForm mt-2">
                <div className="regFormWrapper">
                  <Row>
                    <Col lg={6}>
                      <div className="form_group mt-4">
                        <label htmlFor="first_name">First Name</label>
                        <input
                          className="inputField"
                          name="first_name"
                          type="text"
                          placeholder=""
                          onChange={handleRegisterChange}
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form_group mt-4">
                        <label htmlFor="last_name">Last Name</label>
                        <input
                          className="inputField"
                          name="last_name"
                          type="text"
                          placeholder=""
                          onChange={handleRegisterChange}
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form_group mt-4">
                        <label htmlFor="email">Email</label>
                        <input
                          className="inputField"
                          name="email"
                          type="email"
                          placeholder="abc@gmail.com"
                          onChange={handleRegisterChange}
                        />
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form_group mt-4">
                        <label htmlFor="phone">Mobile Number</label>
                        <input
                          className="inputField"
                          name="phone"
                          type="number"
                          placeholder="(+971)"
                          onChange={handleRegisterChange}
                        />
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="form_group mt-4">
                        <label htmlFor="password">Password</label>
                        <input
                          className="inputField"
                          name="password"
                          type="password"
                          placeholder=""
                          onChange={handleRegisterChange}
                        />
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="form_group mt-4">
                        <label htmlFor="vrify_password">Verify Password</label>
                        <input
                          className="inputField"
                          name="vrify_password"
                          type="password"
                          placeholder=""
                          onChange={handleRegisterChange}
                        />
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className="mt-3 btnWrapper">
                  <button
                    className="btnNl btnNl-secondary"
                    onClick={() => {
                      navigate("/login");
                    }}
                  >
                    Login
                  </button>
                  <button
                    className="btnNl btnNl-primary"
                    disabled={isRegisterSending}
                    onClick={handleRegisterSubmit}
                  >
                    {isRegisterSending ? "Registering..." : "Create Account"}
                  </button>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="imgWrapper">
              <img src={thumb} alt="" />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Index;
