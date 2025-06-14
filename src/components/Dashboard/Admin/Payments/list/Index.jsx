import React from "react";
import DataTable from "react-data-table-component";
import imgThumb from "src/assets/thumb.png";

import "./styles.scss";
import { useNavigate, useParams } from "react-router-dom";
import { FaCalendarDays } from "react-icons/fa6";
function Index() {
  const navigate = useNavigate();
  const { lang = "en" } = useParams();

  let data = [
    {
      id: "1",
      package: "Standard Balloon Ride",
      thumb: imgThumb,
      Date: "11-09-24",
      price: "Aed 10,000",
      total_bookings: "50",
    },
    {
      id: "2",
      package: "Luxury Balloon Ride",
      thumb: imgThumb,
      Date: "11-09-24",
      price: "Aed 15,000",
      total_bookings: "20",
    },
    {
      id: "3",
      package: "Private Balloon Ride",
      thumb: imgThumb,
      Date: "11-09-24",
      price: "Aed 15,000",
      total_bookings: "30",
    },
  ];
  let columns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.id}</div>,
      maxWidth: "120px",
    },
    {
      name: "Clients",
      selector: (row) => row?.id,
      sortable: true,
      minWidth: "350px",
      cell: (row) => (
        <div className="d-flex justify-content-start align-items-center">
          <img src={row?.thumb} height={80} width={80} />
          <div className="Table_Package Table_Item">{row?.package}</div>
        </div>
      ),
    },

    {
      name: "Url",
      selector: (row) => row?.id,
      sortable: true,
      cell: (row) => <div className="Table_Item">/</div>,
    },

    {
      name: "Action",
      selector: (row) => row?.id,
      sortable: true,
      minWidth: "200px",
      cell: (row) => (
        <div className="Table_Item w-100 ActionbtnWrapper">
          <button
            className="btnNl btnNl-primary"
            onClick={() => {
              navigate(`/${lang}/admin/client/edit/${row?.id}`);
            }}
          >
            Edit
          </button>
          <button className="btnNl btnNl-secondary ml-3">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="PaymentLists0d32">
      <div className="tabltitlCon">
        <div className="title">Payment History</div>
        <div className="bTnWrapper">
          <div className="btnNl btnNl-secondary">
            <div>
              <FaCalendarDays size={16} />
              &nbsp;&nbsp; Filter
            </div>
          </div>
        </div>
      </div>

      <DataTable
        className="dataTable-custom"
        data={data}
        columns={columns}
        noHeader
        pagination
        subHeader
      />
    </div>
  );
}

export default Index;
