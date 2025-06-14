import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopEditbar from "./TopBar/Index";
import { Col, Row } from "react-bootstrap";
import package1 from "src/assets/package/package1.png";
import commonApi from "src/api/commonApi";
import { toast } from "react-toastify";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import placeHolder from "src/assets/placeholder.png";
import "./styles.scss";
import { useSelector } from "react-redux";
import { MdContentCopy } from "react-icons/md";
function Index() {
  const { id } = useParams();
  const { lang = "en" } = useParams();
  const auth = useSelector((state) => state.auth);
  const { getOneUser, UpdateOneUser, AddUser } = commonApi();
  const [isEdit, setIsEdit] = useState(false);
  const [UserData, setUserData] = useState({});
  console.log("🚀 ~ Index ~ UserData:", UserData);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "remark") {
      // Update the remark directly
      setUserData((prev) => ({ ...prev, remark: value }));
      return;
    }
    if (name === "is_verified_byadmin") {
      let verifiedByAdmin;

      // Map the selected string back to boolean values
      if (value === "verified") {
        verifiedByAdmin = true; // For Verified, set to true
      } else if (value === "pending") {
        verifiedByAdmin = null; // Assuming you want to represent Pending as null
      } else if (value === "rejected") {
        verifiedByAdmin = false; // For Rejected, set to false
      }

      setUserData((prev) => ({ ...prev, [name]: verifiedByAdmin }));
      return;
    }
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const getSingleUser = async () => {
    const response = await getOneUser(id);
    if (response?.status == 200) {
      setUserData(response?.data);
    } else {
      toast.error(
        response?.data?.error || "Something Went Wrong Please Try again later",
        {
          toastId: "UserDataError",
        }
      );
    }
  };

  const handleSubmit = async () => {
    console.log("Submit: ", UserData);
    const payload = {};
    payload.first_name = UserData.first_name;
    payload.last_name = UserData.last_name;
    payload.email = UserData.email;
    payload.remark = UserData.remark;
    payload.phone = UserData.phone;
    payload.role = UserData.role;
    payload.is_verified = UserData.is_verified;
    payload.is_verified_byadmin = UserData.is_verified_byadmin;
    console.log(payload);

    setIsLoading(true);
    const response = await UpdateOneUser(id, payload);
    if (response?.status == 200) {
      toast.success("User Updated Successfully");
      setUserData(response?.data?.user);
      setIsEdit(false);
      setIsLoading(false);
    } else {
      toast.error(
        response?.data?.error || "Something Went Wrong Please Try again later",
        {
          toastId: "UserDataError",
        }
      );
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (id) {
      getSingleUser();
    } else {
      setIsEdit(true);
    }
  }, [id]);

  const handleAddNewUser = async (e) => {
    let UpdatedData = { ...UserData };

    setIsLoading(true);

    //! validation
    if (!UpdatedData.first_name) {
      setIsLoading(false);
      toast.error("Please Enter First Name");
      return;
    }
    if (!UpdatedData.last_name) {
      setIsLoading(false);
      toast.error("Please Enter Last Name");
      return;
    }
    if (!UpdatedData.email) {
      setIsLoading(false);
      toast.error("Please Enter Email Address");
      return;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(UpdatedData?.email)) {
      setIsLoading(false);
      toast.error("Email is Invalid");
      return;
    }
    if (!UpdatedData.phone) {
      setIsLoading(false);
      toast.error("Please Enter Phone No");
      return;
    }
    if (!UpdatedData.password) {
      setIsLoading(false);
      toast.error("Please Enter A Valid Password");
      return;
    }
    if (UpdatedData.password !== UpdatedData?.vrify_password) {
      setIsLoading(false);
      toast.error("Please Enter Matching Password");
      return;
    }
    let header = {
      headers: {
        Authorization: `Bearer ${auth?.token}`,
      },
    };

    const response = await AddUser(UpdatedData, header);

    if (response?.status == 200 || response?.status == 201) {
      toast.success("User Added Successfully");
      setIsLoading(false);
      navigate(`/${lang}/admin/client`);
    } else {
      toast.error(
        response?.data?.error || "Something Went Wrong Please Try again later"
      );
      setIsLoading(false);
    }
  };
  return (
    <div className="packageFormds39">
      <TopEditbar
        id={id}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        handleSubmit={handleSubmit}
        handleAddNewUser={handleAddNewUser}
        isLoading={isLoading}
      />
      <div className="FormWrapper mt-40">
        <Row>
          {/* <Col md={3}>
            <div className="ImgUploadSec">
              <img src={package1} alt="packge-thumb" height={200} width={200} />
              <div className="btnWrapper mt-3">
                <button className="btnNl btnNl-primary">Upload</button>
                <button className="btnNl btnNl-secondary">Remove</button>
              </div>
            </div>
          </Col> */}
          <Col xs={12}>
            <div className="InputSec">
              <Row>
                <Col xs={12} md={6}>
                  <div className="form_group mt-4">
                    <label htmlFor={"first_name"}>First Name</label>
                    <input
                      className="inputField"
                      name={"first_name"}
                      type="text"
                      placeholder=""
                      disabled={isEdit ? false : true}
                      value={UserData?.first_name}
                      onChange={handleChange}
                    />
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="form_group mt-4">
                    <label htmlFor={"last_name"}>Last Name</label>
                    <input
                      className="inputField"
                      name={"last_name"}
                      type="text"
                      placeholder=""
                      disabled={isEdit ? false : true}
                      value={UserData?.last_name}
                      onChange={handleChange}
                    />
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="form_group mt-4">
                    <label htmlFor={"email"}>Email</label>
                    <input
                      className="inputField"
                      name={"email"}
                      type="email"
                      placeholder=""
                      disabled={isEdit ? false : true}
                      value={UserData?.email}
                      onChange={handleChange}
                    />
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="form_group mt-4">
                    <label htmlFor="Mobile">Mobile Number</label>

                    <input
                      className="inputField"
                      // defaultCountry="ae"
                      value={UserData?.phone}
                      disabled={!isEdit}
                      onChange={(phone) =>
                        setUserData((prev) => ({ ...prev, phone }))
                      }
                      inputStyle={{ width: "100%" }} // Set the input width to 100%
                      buttonStyle={{ display: "none" }} // Hide the flag button
                    />
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="form_group mt-4">
                    <label htmlFor={"role"}>Role</label>
                    <select
                      className="inputField"
                      name={"role"}
                      type="text"
                      placeholder=""
                      disabled={isEdit ? false : true}
                      value={UserData?.role}
                      onChange={handleChange}
                    >
                      <option value="B2B-Influencer">B2B Influencer</option>
                      <option value="B2B-Individual">B2B Individual</option>
                      <option value="B2B-company">B2B Company</option>
                    </select>
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="form_group mt-4">
                    <label htmlFor={"is_verified"}>Email Verification</label>
                    <select
                      className="inputField"
                      name={"is_verified"}
                      type="text"
                      placeholder=""
                      disabled={isEdit ? false : true}
                      value={UserData?.is_verified}
                      onChange={handleChange}
                    >
                      <option value={true}>Verified</option>
                      <option value={false}>Pending</option>
                    </select>
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="form_group mt-4">
                    <label htmlFor={"is_verified_byadmin"}>
                      Admin Verification
                    </label>
                    <select
                      className="inputField"
                      name={"is_verified_byadmin"}
                      disabled={!isEdit} // Disable if not in edit mode
                      value={
                        UserData?.is_verified_byadmin === true
                          ? "verified"
                          : UserData?.is_verified_byadmin === false
                          ? "rejected"
                          : "pending"
                      }
                      onChange={handleChange}
                    >
                      <option value="verified">Verified</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </Col>
                <Col xs={12} md={6}>
                  <div className="form_group form_groupPhone mt-4">
                    <label htmlFor="Mobile">Reference Code</label>
                    <div
                      className="refCode"
                      onClick={() => {
                        navigator.clipboard.writeText(UserData?.referral_code);
                        toast.info("Copied to Clipboard", {
                          autoClose: 1000,
                          hideProgressBar: true,
                        });
                      }}
                    >
                      {UserData?.referral_code}{" "}
                      <MdContentCopy className="cpyIcon" size={20} />
                    </div>
                  </div>
                </Col>
                <Col xs={12} md={12}>
                  <div className="form_group mt-4">
                    <label htmlFor={"remark"}>Remark</label>
                    <textarea
                      className="inputField"
                      name={"remark"}
                      placeholder=""
                      disabled={isEdit ? false : true}
                      value={UserData?.remark}
                      onChange={handleChange}
                      rows={2}
                    />
                  </div>
                </Col>
              </Row>
              {/*//# Images Upladed Show */}

              {UserData.role == "B2B-company" ? (
                <Row className="mt-4 gy-3">
                  <Col xs={12} md={4}>
                    <label className="mb-3">Trade License</label>
                    <a href={UserData?.trade_license} target="__blank">
                      <div className="ImgUploadSec">
                        <img
                          src={
                            UserData?.trade_license
                              ? UserData?.trade_license
                              : placeHolder
                          }
                          height={200}
                          width={200}
                        />
                      </div>
                    </a>
                  </Col>
                  <Col xs={12} md={4}>
                    <label className="mb-3">TRN Certificate</label>
                    <a href={UserData?.trn_certificate} target="__blank">
                      <div className="ImgUploadSec">
                        <img
                          src={
                            UserData?.trn_certificate
                              ? UserData?.trn_certificate
                              : placeHolder
                          }
                          height={200}
                          width={200}
                        />
                      </div>
                    </a>
                  </Col>
                  <Col xs={12} md={4}>
                    <label className="mb-3">Emirates ID / National ID</label>

                    <a href={UserData?.emt_id} target="__blank">
                      <div className="ImgUploadSec">
                        <img
                          src={
                            UserData?.emt_id ? UserData?.emt_id : placeHolder
                          }
                          height={200}
                          width={200}
                        />
                      </div>
                    </a>
                  </Col>
                  <Col xs={12} md={4}>
                    <label className="mb-3">Owner Passport Copy</label>
                    <a href={UserData?.owner_passport} target="__blank">
                      <div className="ImgUploadSec">
                        <img
                          src={
                            UserData?.owner_passport
                              ? UserData?.owner_passport
                              : placeHolder
                          }
                          height={200}
                          width={200}
                        />
                      </div>
                    </a>
                  </Col>
                  <Col xs={12} md={4}>
                    <label className="mb-3">Visa Copy</label>
                    <a href={UserData?.visa_copy} target="__blank">
                      <div className="ImgUploadSec">
                        <img
                          src={
                            UserData?.visa_copy
                              ? UserData?.visa_copy
                              : placeHolder
                          }
                          height={200}
                          width={200}
                        />
                      </div>
                    </a>
                  </Col>
                </Row>
              ) : (
                <Row className="mt-4">
                  <Col xs={12} md={6}>
                    <label className="mb-3">Emirates ID / National ID</label>

                    <a href={UserData?.emt_id} target="__blank">
                      <div className="ImgUploadSec">
                        <img
                          src={
                            UserData?.emt_id ? UserData?.emt_id : placeHolder
                          }
                          height={200}
                          width={200}
                        />
                      </div>
                    </a>
                  </Col>
                  <Col xs={12} md={6}>
                    <label className="mb-3">passport_id Copy</label>
                    <a href={UserData?.passport_id} target="__blank">
                      <div className="ImgUploadSec">
                        <img
                          src={
                            UserData?.passport_id
                              ? UserData?.passport_id
                              : placeHolder
                          }
                          height={200}
                          width={200}
                        />
                      </div>
                    </a>
                  </Col>
                </Row>
              )}

              {/* only for nt */}
              {!id ? (
                <Row>
                  <Col xs={12} md={6}>
                    <div className="form_group mt-4">
                      <label htmlFor="password">Password</label>
                      <input
                        className="inputField"
                        name="password"
                        type="password"
                        placeholder=""
                        onChange={handleChange}
                      />
                    </div>
                  </Col>
                  <Col xs={12} md={6}>
                    <div className="form_group mt-4">
                      <label htmlFor="vrify_password">Verify Password</label>
                      <input
                        className="inputField"
                        name="vrify_password"
                        type="password"
                        placeholder=""
                        onChange={handleChange}
                      />
                    </div>
                  </Col>
                </Row>
              ) : null}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Index;
