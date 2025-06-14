import React, { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import thumb from "src/assets/Auth/testimonial.jpg";
import social1 from "src/assets/icons/google_symbol.svg.svg";
import social2 from "src/assets/icons/facebook.svg";
import social3 from "src/assets/icons/linkedin_symbol.svg.svg";
import social4 from "src/assets/icons/or.svg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./styles.scss";
import { LoginUser, LogoutUser } from "src/store/auth";
import { toast } from "react-toastify";
import commonApi from "src/api/commonApi";
function Index(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Login User

  const [LogFormData, setLogFormData] = useState({ email: "" });
  const [isLoading, setIsloadng] = useState(false);

  const { PostForgotPass } = commonApi();

  const handleChange = (e) => {
    setLogFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setIsloadng(true);
    if (!LogFormData?.email) {
      toast.error("Please Enter a Valid Email");
      setIsloadng(false);

      return;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(LogFormData?.email)) {
      setIsloadng(false);
      toast.error("Email is Invalid");
      return;
    }
    let Payload = {
      emailOrPhone: LogFormData?.email,
    };
    const response = await PostForgotPass(Payload);
    console.log("🚀 ~ handleSubmit ~ response:", response);

    if (response?.status == 200 || response?.status == 201) {
      setIsloadng(false);
      toast.success(
        response?.data?.message || "Verification Token Sent to Email"
      );
      navigate("/login");
    } else {
      setIsloadng(false);
      toast.error(response?.data?.error || "Something Went Wrong");
    }
  };

  return (
    <div className="LoginCustomer32">
      <Container>
        <Row className="gy-3">
          <Col lg={6}>
            <div className="formWrapper">
              <div className="form-title">
                Welcome to Maha Balloon Dashboard
              </div>
              <p className="form-details mt-2">Generate Password</p>
              <div className="loginform mt-2">
                <div className="form_group mt-4">
                  <label htmlFor="email">Email</label>
                  <input
                    className="inputField"
                    name="email"
                    type="email"
                    placeholder="abc@gmail.com"
                    onChange={handleChange}
                  />
                </div>

                <div className="mt-3 btnWrapper">
                  <button
                    className="btnNl btnNl-primary"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending.." : "Submit"}
                  </button>
                  <button
                    className="btnNl btnNl-secondary"
                    onClick={() => {
                      navigate("/register");
                    }}
                  >
                    Create Account
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
