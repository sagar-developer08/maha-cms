import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TopEditbar from "./TopBar/Index";
import { Col, Row } from "react-bootstrap";
import package1 from "src/assets/package/package1.png";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { BsUpload } from "react-icons/bs";
import Upload from "src/components/common/Upload";
// api
import {
  getSinglePackage,
  postPackage,
  updatePackage,
  postItinary,
  getSingleItinary,
  deleteItinary,
  updateItinary,
} from "../../../../../api/packagesAPI";
// css
import "./styles.scss";

const initObj = {
  title: "", // Assuming package_name is 'title'
  route: "",
  price_adult: "",
  price_child: "",
  location: "",
  featured: true,
  short_detail: "",
  duration: "",
  Details: "[]", // Initial value as a stringified empty array
  seo: "{}", // Initial value as a stringified empty object
};

const initItrObj = {
  activity: "",
  details: "",
  feature_img: "",
};

function Index() {
  const { id } = useParams();
  const navigate = useNavigate();
  const urlSearchString = window.location.search;
  const params = new URLSearchParams(urlSearchString);
  const itrId = params?.get("itinaryId");
  const [formData, setFormData] = useState({ ...initObj });
  const [packageImage, setPackageImage] = useState(null);
  const [itinaryImage, setItinaryImage] = useState(null);
  const [packageImageToView, setPackageImageToVIew] = useState(null);
  const [itenaryShow, setItenaryShow] = useState(false);
  const [itenaryList, setItenaryList] = useState([]);
  const [itenaryId, setItenaryId] = useState(id ? id : "");
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsloadng] = useState(false);
  const [isItrLoading, setIsItrloadng] = useState(false);
  const [itinirayField, seItinirayField] = useState({ ...initItrObj });
  const [isItrEdit, setIsItrEdit] = useState(false);
  const [PackageID, setPackageId] = useState(false);

  //  single Package Data
  const fetchSinglePackageData = async () => {
    try {
      setLoading(true); // Show the loader
      const { data } = await getSinglePackage(id);
      setFormData(data);
      setItenaryList(data?.itineraries);
      setPackageImage(data.package_image || null);
      setUploadedUrls(data.package_image || null);
    } catch (error) {
      console.error("Error fetching Data:", error);
      setError(error);
    } finally {
      setLoading(false); // Hide the loader
    }
  };

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    if (id) {
      setItenaryShow(true);
      setIsEdit(true);
      fetchSinglePackageData();
    }
  }, [id]);

  const [dyNmInputField, setDyNmInputField] = useState([
    { id: 1, title: "", details: "", featured_img: "" },
  ]);

  const handleDynamicupload = (e, i) => {
    let UpdatedData = [...dyNmInputField];
    UpdatedData[i]["featured_img"] = e.target.files[0];
    UpdatedData[i]["prev_img"] = URL.createObjectURL(e.target.files[0]);

    setDyNmInputField(UpdatedData);
  };

  const handledynmInputFieldChange = (e, i) => {
    let UpdatedData = [...dyNmInputField];
    UpdatedData[i][e.target.name] = e.target.value;
    setDyNmInputField(UpdatedData);
  };

  const handleItinaryUpload = (e) => {
    let UpdatedData = { ...itinirayField };
    UpdatedData.feature_img = e.target.files[0];
    seItinirayField(UpdatedData);
  };

  const handleItinaryChange = (e, i) => {
    let UpdatedData = { ...itinirayField };
    UpdatedData[e.target.name] = e.target.value;
    seItinirayField(UpdatedData);
  };

  const UpdateFields = (type, i) => {
    if (type == "add") {
      let UpdatedData = [...dyNmInputField];
      UpdatedData.push({
        id: Math.floor(Math.random() * 9564),
        title: "",
        details: "",
        featured_img: "",
      });
      setDyNmInputField(UpdatedData);
      // addItenoryData(UpdatedData);
      return;
    }
    if (type == "remove") {
      let UpdatedData = [...dyNmInputField];
      UpdatedData.splice(i, 1);
      setDyNmInputField(UpdatedData);
      return;
    }
  };

  //  add Itinary
  const addItenoryData = async () => {
    const updatedData = { ...itinirayField };
    let formData = {
      packageId: id ? id : PackageID,
      activity: updatedData?.activity,
      details: updatedData?.details,
      feature_img: UploadedUrls,
    };
    let data = new FormData();
    data.append("feature_img", formData?.feature_img);
    data.append("packageId", itenaryId);
    data.append("activity", formData?.activity);
    data.append("details", formData?.details);
    // data.append("day", 1);

    if (itrId) {
      try {
        setIsItrloadng(true);

        const response = await updateItinary(formData, itrId);
        if (response.status === 200 || response.status === 201) {
          setIsItrloadng(false);
          setItenaryShow(true);
          setItenaryId(response.data?.id);
          toast.success("Itinerary Added Successfully!");
          setFormData({ ...initObj });
          fetchSinglePackageData();

          navigate({
            pathname: `/en/admin/package/edit/${id}`,
          });
        }
      } catch (error) {
        console.error("Error fetching Data:", error);
        setIsItrloadng(false);
        toast.error("Something Went wrong!");
      }
    } else {
      try {
        setIsItrloadng(true);

        const response = await postItinary(formData);
        console.log("🚀 ~ addItenoryData ~ response:", response);
        if (response.status === 200 || response.status === 201) {
          setIsItrloadng(false);
          setItenaryShow(true);
          setItenaryId(response.data?.id);
          setItenaryList((prev) => [...prev, response.data]);
          toast.success("Itinerary Added Successfully!");
          setFormData({ ...initObj });
        }
      } catch (error) {
        console.error("Error fetching Data:", error);
        setIsItrloadng(false);
        toast.error("Something Went wrong!");
      }
    }
  };

  // get single itinary data
  const fetchSingleItinaryData = async () => {
    try {
      const { data } = await getSingleItinary(itrId);
      seItinirayField(data);
      setItinaryImage(data?.feature_img);
    } catch (error) {
      console.error("Error fetching Data:", error);
    }
  };

  // useEffect(() => {
  //   console.log("🚀 ~ fetchSingleItinaryData ~ itrId:", itrId);
  //   if (itrId) {
  //     setIsItrEdit(true);
  //     fetchSingleItinaryData();
  //   }
  // }, [itrId]);

  const handleDelete = async (id) => {
    try {
      setIsloadng(true);
      const response = await deleteItinary(id);
      let updatedList = itenaryList?.filter((item) => item?.id !== id);
      setItenaryList(updatedList);
      toast.success("Itinerary Deleted Successfully!");
      fetchItenaries();
    } catch (err) {
      setIsloadng(false);
      console.error(err);
    } finally {
      setIsloadng(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setPackageImage(e.target.files[0]);
    setPackageImageToVIew(URL.createObjectURL(e.target.files[0]));
  };
  const widgetRef = useRef();
  const [UploadedUrls, setUploadedUrls] = useState("");
  const [currentFile, setCurrentFile] = useState("");
  const [TotalUploads, setTotalUploads] = useState({});

  const handleSubmit = async () => {
    let data = new FormData();
    data.append("package_image", UploadedUrls);
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    formData.package_image = UploadedUrls;

    if (!UploadedUrls) {
      toast.error("Add Package Image");
      return;
    }

    if (isEdit) {
      try {
        setIsloadng(true);
        let updatedData = {...formData}
        updatedData.seo = JSON.stringify(formData?.seo)

        const response = await updatePackage(updatedData);
        if (response.status === 200 || response.status === 201) {
          setIsloadng(false);
          setItenaryShow(true);
          setItenaryId(response.data?.id);
          setIsloadng(false);
          toast.success("Package has been Updated Successfully!");
          setFormData({ ...initObj });
        }
      } catch (error) {
        setIsloadng(false);
        console.error("Error fetching Data:", error);
        setIsloadng(false);
        toast.error("Something Went wrong!");
      }
    } else {
      try {
        setIsloadng(true);
        const response = await postPackage(formData);
        setItenaryShow(true);
        if (response.status === 200 || response.status === 201) {
          setIsloadng(false);
          setItenaryId(response.data?.id);
          setPackageId(response.data?.id);
          setIsloadng(false);
          toast.success("Package has been Added Successfully!");
          setFormData({ ...initObj });
        } else {
          setIsloadng(false);
          toast.error(response.data?.error);
        }
      } catch (error) {
        setIsloadng(false);
        console.error("Error fetching Data:", error);
        setIsloadng(false);
        toast.error("Something Went wrong!");
      }
    }
  };

  const inputFields = [
    { name: "title", label: "Package Name" },
    { name: "route", label: "Slug" },
    { name: "price_adult", label: "Price (Adult)" },
    { name: "price_child", label: "Price (Child)" },
    { name: "location", label: "Location" },
    { name: "short_detail", label: "Short Detail" },
    { name: "duration", label: "Timeline" },
    // { name: "Details", label: "Details (JSON)" }, // JSON data
    // { name: "seo", label: "SEO (JSON)" }, // JSON data
  ];

  useEffect(() => {
    if (currentFile) {
      widgetRef.current.open();
    }
  }, [currentFile]);

  useEffect(() => {
    if (UploadedUrls) {
      setTotalUploads((prev) => ({ ...prev, [currentFile]: UploadedUrls }));
    }
  }, [UploadedUrls]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="packageFormds39">
      <TopEditbar id={id} />
      <div className="FormWrapper mt-40">
        <Row>
          <Col md={3}>
            <div className="ImgUploadSec">
              <img
                src={
                  TotalUploads?.package_thumb
                    ? TotalUploads?.package_thumb
                    : packageImage
                    ? packageImage
                    : package1
                } // Display fetched image
                alt="package-thumb"
                height={200}
                width={200}
              />
              <div className="btnWrapper mt-3">
                <button
                  className="btnNl btnNl-primary"
                  onClick={() => setCurrentFile("package_thumb")}
                >
                  Upload
                </button>
              </div>
            </div>
          </Col>
          <Col md={9}>
            <div className="InputSec">
              <Row>
                {inputFields?.map((item) => (
                  <Col xs={12} key={item.name}>
                    <div className="form_group mt-4">
                      <label htmlFor={item.name}>{item.label}</label>
                      {item.name === "short_detail" ? (
                        <textarea
                          name="short_detail"
                          className="inputField"
                          value={formData?.short_detail}
                          onChange={handleInputChange}
                          rows={3}
                          style={{ resize: "none" }}
                        ></textarea>
                      ) : (
                        <input
                          className="inputField"
                          name={item.name}
                          type="text"
                          value={formData[item.name]}
                          onChange={handleInputChange}
                          placeholder={
                            item.name === "Details" || item.name === "seo"
                              ? "Enter JSON formatted data"
                              : ""
                          }
                        />
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
              <button
                className="btnNl btnNl-primary mt-4"
                onClick={handleSubmit}
                disabled={isLoading && true}
              >
                {isLoading ? "Submit..." : "Submit"}
              </button>
              {/* Itinerary */}
              {itenaryShow && (
                <Row className="mt-4">
                  <label htmlFor={`"itinerary"`}>Itinerary</label>

                  <Col xs={4}>
                    <div className="form_group mt-4">
                      <label htmlFor={`"activity"`}>Title</label>
                      <input
                        className="inputField"
                        name={"activity"}
                        type="text"
                        value={itinirayField?.activity}
                        onChange={(e) => handleItinaryChange(e)}
                        placeholder={""}
                      />
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="form_group mt-4">
                      <label htmlFor={`"details"`}>Details</label>
                      <input
                        className="inputField"
                        name={"details"}
                        type="text"
                        value={itinirayField?.details}
                        onChange={(e) => handleItinaryChange(e)}
                        placeholder={""}
                      />
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="form_group mt-4">
                      <label>Featured Image</label>
                      <img
                        src={
                          TotalUploads?.itinary_thumb
                            ? TotalUploads?.itinary_thumb
                            : itinaryImage
                            ? itinaryImage
                            : package1
                        } // Display fetched image
                        alt="itinary-thumb"
                        height={100}
                        width={100}
                      />
                      <button
                        className="btnNl btnNl-primary mt-2"
                        style={{ fontSize: "14px" }}
                        onClick={() => setCurrentFile("itinary_thumb")}
                      >
                        Upload
                      </button>
                      {/* <>
                        <label
                          htmlFor={`feature_img`}
                          className={
                            itinirayField?.feature_img
                              ? "FileUPloadWrapper pds-3"
                              : "FileUPloadWrapper"
                          }
                        >
                          {itinirayField?.feature_img ? (
                            <img
                              className="imge_prev"
                              src={itinirayField?.feature_img}
                              alt=""
                              height={50}
                              width={50}
                            />
                          ) : (
                            <label htmlFor="feature_img">Upload(png,jpg)</label>
                          )}

                          <input
                            type="file"
                            id={`feature_img`}
                            name={`feature_img`}
                            accept="image/png, image/jpg"
                            onChange={(e) => handleItinaryUpload(e)}
                          />
                          <BsUpload />
                        </label>
                      </> */}
                    </div>
                  </Col>

                  {/* <Col xs={1}>
                    <div className="RemoveBTN">
                      <button
                        className="btn btn-danger mt-3"
                        onClick={() => UpdateFields("remove", i)}
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </Col> */}

                  <Col xs={12}>
                    <button
                      className="btnNl btnNl-primary mt-3"
                      onClick={addItenoryData}
                      disabled={isItrLoading && true}
                    >
                      {isItrLoading ? "Adding..." : "Add"}
                    </button>
                  </Col>
                </Row>
              )}
              {itenaryList?.length > 0 && (
                <>
                  <h3 className="table-title mt-4">Itinerary List</h3>
                  <table>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Details</th>
                    <th colSpan={2}>Actions</th>
                    {itenaryList?.map((x) => (
                      <tr>
                        <td>
                          <img
                            src={x?.feature_img}
                            alt="img"
                            width={50}
                            height={50}
                          />
                        </td>
                        <td>{x?.activity}</td>
                        <td>{x?.details}</td>
                        <td>
                          <FaEdit
                            className="text-success itrIcon"
                            onClick={() => {
                              seItinirayField(x);
                              setItinaryImage(x?.feature_img);
                              navigate({
                                pathname: `/en/admin/package/edit/${
                                  id ? id : itenaryList
                                }`,
                                search: `?itinaryId=${x?.id}`,
                              });
                            }}
                          />
                          <FaTrash
                            className="ms-2 text-danger itrIcon"
                            onClick={() => handleDelete(x?.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </table>
                </>
              )}
            </div>
          </Col>
        </Row>
      </div>
      <Upload widgetRef={widgetRef} setUploadedUrls={setUploadedUrls} />
    </div>
  );
}

export default Index;

{
  /* <Row className="mt-4">
<label htmlFor={`"itinerary"`}>Itinerary</label>
{dyNmInputField?.map((item, i) => (
  <Fragment key={item?.id}>
    <Col xs={3}>
      <div className="form_group mt-4">
        <label htmlFor={`"title"`}>Title</label>
        <input
          className="inputField"
          name={"title"}
          type="text"
          value={item[i]?.title}
          // onChange={(e) => handledynmInputFieldChange(e, i)}
          onChange={(e) => handleItinaryChange(e)}
          placeholder={""}
        />
      </div>
    </Col>
    <Col xs={4}>
      <div className="form_group mt-4">
        <label htmlFor={`"details"`}>Details</label>
        <input
          className="inputField"
          name={"details"}
          type="text"
          value={item[i]?.details}
          onChange={(e) => handledynmInputFieldChange(e, i)}
          placeholder={""}
        />
      </div>
    </Col>
    <Col xs={3}>
      <div className="form_group mt-4">
        <label>Featured Image</label>
        <>
          <label
            htmlFor={`featured_img${i}`}
            className={
              item?.prev_img
                ? "FileUPloadWrapper pds-3"
                : "FileUPloadWrapper"
            }
          >
            {item?.prev_img ? (
              <img
                className="imge_prev"
                src={item?.prev_img}
                alt=""
                height={50}
                width={50}
              />
            ) : (
              <label htmlFor="featured_img">
                Upload(png,jpg)
              </label>
            )}
            <input
              type="file"
              id={`featured_img${i}`}
              name={`featured_img${i}`}
              accept="image/png, image/jpg"
              onChange={(e) => handleDynamicupload(e, i)}
            />
            <BsUpload />
          </label>
        </>
      </div>
    </Col>

    <Col xs={1}>
      <div className="RemoveBTN">
        <button
          className="btn btn-danger mt-3"
          onClick={() => UpdateFields("remove", i)}
        >
          <FaTrash size={16} />
        </button>
      </div>
    </Col>
  </Fragment>
))}
<Col xs={12}>
  <button
    className="btnNl btnNl-primary mt-3"
    // onClick={() => UpdateFields("add")}
    onClick={addItenoryData}
  >
    Add
  </button>
</Col>
</Row> */
}
