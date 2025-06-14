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
import useAuthApi from "src/api/useAuthApi";
function Index(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Login User

  const [LogFormData, setLogFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsloadng] = useState(false);

  const { PostLogin } = useAuthApi();

  const handleChange = (e) => {
    setLogFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsloadng(true);
    //! validation
    if (!LogFormData?.email) {
      setIsloadng(false);
      toast.error("Please Enter Valid Email");
      return;
    }
    if (!LogFormData?.password) {
      setIsloadng(false);
      toast.error("Please Enter Valid Password");
      return;
    }

    try {
      const response = await PostLogin(LogFormData);
      console.log("🚀 ~ handleSubmit ~ response:", response);

      if (response?.status == 200 || response?.status == 201) {
        const { user, token } = response?.data;
        let payload = {
          userData: user,
          token: token,
          isAuth: true,
          role: user?.role == "admin" ? "admin" : "customer",
          // role: "customer",
          // role: "admin",
        };
        await localStorage.setItem("authToken", token);
        dispatch(LoginUser(payload));
        setTimeout(() => {
          setIsloadng(false);
          toast.success("Logged In  Successfull");
          setLogFormData({ email: "", password: "" });
          navigate("/");
          location.reload();
        }, 2000);
      } else {
        setIsloadng(false);
        toast.error("Invalid Credentials");
      }
    } catch (error) {
      console.log("Catch Block");
      toast.error("Invalid credentials");
      setIsloadng(false);
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
              <p className="form-details mt-2">
                Please sign in to your account
              </p>
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
                <div className="form_group mt-4">
                  <div className="password">
                    <label htmlFor="email">Password</label>
                    <span onClick={() => navigate("/forgot-passwaord")}>
                      Forget Password?
                    </span>
                  </div>
                  <input
                    className="inputField"
                    name="password"
                    type="password"
                    onChange={handleChange}
                  />
                </div>
                <div className="mt-3 btnWrapper">
                  <button
                    className="btnNl btnNl-primary"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging..." : "Login"}
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
                <div className="mt-3 btnWrapper">
                  {/* <button
                    className="btnNl btnNl-primary"
                    onClick={() => {
                      dispatch(
                        LogoutUser({ userData: {}, isAuth: false, role: "" })
                      );
                    }}
                  >
                    Logout
                  </button> */}
                  {/* <button
                    className="btnNl  btnNl-primary btn btn-secondary "
                    onClick={() => {
                      dispatch(
                        LoginUser({ userData: {}, isAuth: true, role: "admin" })
                      );
                    }}
                  >
                    Login as Admin
                  </button> */}

                  {/* <button
                    className="btnNl btnNl-primary"
                    onClick={() => {
                      dispatch(
                        LoginUser({
                          userData: {},
                          isAuth: true,
                          role: "customer",
                        })
                      );
                    }}
                  >
                    Login as Customer
                  </button> */}
                </div>

                <div className="SoicalWrapper">
                  <div className="OrSOicalWrapper">
                    <img src={social4} alt="" />
                  </div>
                  <div className="SocialLog">
                    <img src={social1} alt="google-login" />
                    <img src={social2} alt="facebook-login" />
                    <img src={social3} alt="linkedIn-login" />
                  </div>
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
