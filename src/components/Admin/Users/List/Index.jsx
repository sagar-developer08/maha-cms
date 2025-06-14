import React from "react";
import imgThumb from "src/assets/thumb.png";
import DataTable from "react-data-table-component";

import "./styles.scss";
import { FaCalendarDays } from "react-icons/fa6";
function Index() {
  let data = [
    {
      id: "1",
      name: "Lorem lipsum",
      role: "Customer",
      date: "11-09-24",
      contact: "+xxx xxxxxx",
      status: "Active",
    },
    {
      id: "2",
      name: "Lorem lipsum",
      role: "Customer",
      date: "11-09-24",
      contact: "+xxx xxxxxx",
      status: "Active",
    },
    {
      id: "3",
      name: "Lorem lipsum",
      role: "Customer",
      date: "11-09-24",
      contact: "+xxx xxxxxx",
      status: "Active",
    },
    {
      id: "4",
      name: "Lorem lipsum",
      role: "Customer",
      date: "11-09-24",
      contact: "+xxx xxxxxx",
      status: "Active",
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
      name: "Users",
      selector: (row) => row?.id,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.name}</div>,
    },
    {
      name: "Role",
      selector: (row) => row?.id,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.role}</div>,
    },

    {
      name: "Date",
      selector: (row) => row?.id,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.date}</div>,
    },
    {
      name: "Contact",
      selector: (row) => row?.id,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.contact}</div>,
    },
    {
      name: "Status",
      selector: (row) => row?.id,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.status}</div>,
    },
    {
      name: "Action",
      selector: (row) => row?.id,
      sortable: true,
      minWidth: "250px",
      cell: (row) => (
        <div className="Table_Item w-100 ActionbtnWrapper">
          <button className="btnNl btnNl-primary">Delete</button>
        </div>
      ),
    },
  ];
  return (
    <div className="TableWallet39">
      <div className="tabltitlCon">
        <div className="title">Active Users</div>
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
