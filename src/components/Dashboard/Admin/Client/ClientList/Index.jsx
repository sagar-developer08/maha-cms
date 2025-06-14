import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import imgThumb from "src/assets/thumb.png";

import "./styles.scss";
import { Link, useNavigate, useParams } from "react-router-dom";
import commonApi from "src/api/commonApi";
import { Badge, Col, Row } from "react-bootstrap";
import moment from "moment";
import { toast } from "react-toastify";
function Index() {
  const navigate = useNavigate();
  const { lang = "en" } = useParams();
  const [OriginallistData, setOriginallistData] = useState([]);
  const [listData, setListData] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [ItemDeleting, setItemDeleting] = useState();
  const { getUsersList, DeleteOneUser } = commonApi();

  const getUsersListData = async () => {
    const resp = await getUsersList();

    setListData(resp?.data);
    setOriginallistData(resp?.data);
  };
  const DeleteUser = async (id) => {
    setIsDeleting(true);
    setItemDeleting(id);
    const response = await DeleteOneUser(id);

    if (response?.status == 200) {
      toast.success("User Deleted Successfully");
      await getUsersListData();
      setIsDeleting(false);
      setItemDeleting("");
    } else {
      toast.error(
        response?.data?.error || "Something Went Wrong Please Try again later"
      );
      setItemDeleting("");
      setIsDeleting(false);
    }
    setIsDeleting(false);
    setItemDeleting("");
  };
  const handleCatFilter = async (e) => {
    let value = e.target.value;
    if (value == "all") {
      setListData(structuredClone(OriginallistData));
      return;
    }
    let updatedData = await OriginallistData?.filter(
      (item) => item?.role == value
    );
    setListData(structuredClone(updatedData));
  };

  let columns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.id}</div>,
      maxWidth: "120px",
      id: "id",
    },
    // {
    //   name: "Clients",
    //   selector: (row) => row?.package,
    //   sortable: true,
    //   minWidth: "350px",
    //   cell: (row) => (
    //     <div className="d-flex justify-content-start align-items-center">
    //       <img src={row?.thumb} height={80} width={80} />
    //       <div className="Table_Package Table_Item">{row?.package}</div>
    //     </div>
    //   ),
    // },

    {
      name: "Full Name",
      selector: (row) => row?.first_name,
      sortable: true,
      minWidth: "250px",

      cell: (row) => (
        <div className="Table_Item">
          {row?.first_name} {row?.last_name}
        </div>
      ),
    },
    {
      name: "Email",
      selector: (row) => row?.email,
      sortable: true,
      minWidth: "250px",

      cell: (row) => <div className="Table_Item">{row?.email}</div>,
    },
    {
      name: "Phone",
      selector: (row) => row?.phone,
      sortable: true,
      minWidth: "250px",

      cell: (row) => <div className="Table_Item">{row?.phone}</div>,
    },
    {
      name: "Verified",
      selector: (row) => row?.is_verified,
      sortable: true,
      minWidth: "200px",
      cell: (row) => (
        <div className="Table_Item">
          {row?.is_verified ? (
            <>
              <Badge pill bg="success">
                Verified
              </Badge>
            </>
          ) : (
            <>
              <Badge pill bg="warning">
                pending
              </Badge>
            </>
          )}
        </div>
      ),
    },

    {
      name: "Admin Verified",
      selector: (row) => row?.is_verified_byadmin,
      sortable: true,
      minWidth: "200px",
      cell: (row) => (
        <div className="Table_Item">
          {row?.is_verified_byadmin ? (
            <>
              <Badge pill bg="success">
                Verified
              </Badge>
            </>
          ) : (
            <>
              <Badge pill bg="warning">
                pending
              </Badge>
            </>
          )}
        </div>
      ),
    },
    {
      name: "Created At: ",
      selector: (row) => row?.createdAt,
      sortable: true,
      minWidth: "250px",
      cell: (row) => (
        <div className="Table_Item">
          {moment(row?.createdAt).format("DD-MMM-YYYY")}
        </div>
      ),
    },
    {
      name: "Action",
      sortable: false,
      minWidth: "280px",
      cell: (row) => (
        <div className="Table_Item w-100 ActionbtnWrapper">
          <Link
            to={`/${lang}/admin/client/edit/${row?.id}`}
            className="btnNl btnNl-primary"
          >
            View
          </Link>
          <button
            className="btnNl btnNl-secondary ml-3"
            onClick={() => DeleteUser(row?.id)}
            disabled={isDeleting}
          >
            {ItemDeleting == row?.id ? "Deleting" : "Delete"}
          </button>
        </div>
      ),
    },
  ];
  useEffect(() => {
    getUsersListData();
  }, []);

  return (
    <div className="clientLIst900d32">
      <div className="tabltitlCon">
        <div className="title">Users</div>
        <div className="bTnWrapper">
          <button
            className="btnNl btnNl-primary"
            onClick={() => {
              navigate(`/${lang}/admin/client/add`);
            }}
          >
            Add New
          </button>
        </div>
      </div>
      <Row>
        <Col md={3}>
          <div className="form_group mt-4">
            <label htmlFor={"role"}>Role</label>
            <select
              className="inputField"
              name={"role"}
              type="text"
              placeholder=""
              defaultValue={"all"}
              onChange={(e) => handleCatFilter(e)}
            >
              <option value="all">All</option>
              <option value="B2B-Influencer">B2B Influencer</option>
              <option value="B2B-Individual">B2B Individual</option>
              <option value="B2B-company">B2B Company</option>
            </select>
          </div>
        </Col>
        <Col md={4}></Col>
      </Row>
      <DataTable
        className="dataTable-custom"
        data={listData}
        columns={columns}
        noHeader
        pagination
        subHeader
        defaultSortFieldId="id"
        defaultSortAsc={false}
      />
    </div>
  );
}

export default Index;
