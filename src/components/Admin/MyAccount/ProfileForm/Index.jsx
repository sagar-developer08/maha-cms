import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import avatarP from "src/assets/avatar/Profile.png";
import commonApi from "src/api/commonApi";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { UpdateUser } from "src/store/auth";

function Index() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    ann_date: "",
    partner: "",
    partner_dob: "",
    nationality: "",
    country_of_residence: "",
  });
  const { UpdateOneUser, getOneUser } = commonApi();

  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  // Retrieve persisted data from localStorage
  const persistedData = localStorage.getItem("persist:root");
  let authData = null; // Initialize authData

  if (persistedData) {
    // Parse the persisted data
    const parsedData = JSON.parse(persistedData);

    // Access the auth data
    authData = parsedData.auth ? JSON.parse(parsedData.auth) : null;
    // console.log(authData);
  }

  useEffect(() => {
    const getUserData = async () => {
      const response = await getOneUser(userData?.id);
      let UpdatedData = response?.data;

      setFormData({
        first_name: UpdatedData?.first_name,
        last_name: UpdatedData?.last_name,
        email: UpdatedData?.email,
        phone: UpdatedData?.phone,
        ann_date: UpdatedData?.ann_date,
        partner: UpdatedData?.partner, // Update as needed
        partner_dob: UpdatedData?.partner_dob, // Update as needed
        nationality: UpdatedData?.nationality, // Update as needed
        country_of_residence: UpdatedData?.country_of_residence, // Update as needed
      });
    };
    getUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call your API to update the user data here
      await UpdateOneUser(authData.userData.id, formData); // Pass user ID and updated formData
      console.log("User updated successfully:", formData);
      const response = await getOneUser(userData?.id);
      dispatch(UpdateUser(response?.data));
      setIsEditing(false); // Exit editing mode after submission
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className="ProfileFOrmd9d3KJ mt-40">
      <div className="FormWrapper">
        <Row className="gx-5">
          <Col xs={12}>
            <div className="ProifleWrapper">
              <img
                className="avatars"
                src={avatarP}
                alt="avatar"
                height={80}
                width={80}
              />
              <button className="btnNl btnNl-primary">Upload</button>
              <button className="btnNl btnNl-secondary">Remove</button>
            </div>
          </Col>
          {Object.keys(formData).map((key) => (
            <Col md={6} key={key}>
              <div className="form_group mt-4">
                <label htmlFor={key}>
                  {key.replace("_", " ").toUpperCase()}
                </label>
                {isEditing ? (
                  <input
                    className="inputField"
                    name={key}
                    type={
                      key === "email"
                        ? "email"
                        : key === "dob" ||
                          key === "ann_date" ||
                          key === "partner_dob"
                        ? "date"
                        : "text"
                    }
                    value={formData[key]}
                    onChange={handleChange}
                  />
                ) : (
                  <p>{formData[key] || "N/A"}</p>
                )}
              </div>
            </Col>
          ))}
          <Col xs={12}>
            <button
              className="btnNl btnNl-primary mt-4"
              onClick={isEditing ? handleSubmit : () => setIsEditing(true)}
            >
              {isEditing ? "Save Changes" : "Edit"}
            </button>
          </Col>
        </Row>
      </div>
    </div>
  );
}

export default Index;
