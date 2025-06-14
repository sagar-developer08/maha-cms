import React from "react";
import DataTableComp from "src/components/TableComp/Index";
import imgThumb from "src/assets/thumb.png";

import "./styels.scss";

function Index() {
  let data = [
    {
      id: "#120",
      package: "Standard Balloon Ride",
      thumb: imgThumb,
      Date: "11-09-24",
      Time: "03:00pm",
      Adutls: "2 Adults",
      Child: "1 Child",
      price: "Aed 1,250",
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
      name: "Package Type",
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
      name: "Date",
      selector: (row) => row?.id,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.Date}</div>,
    },
    {
      name: "Time",
      selector: (row) => row?.id,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.Time}</div>,
    },
    {
      name: "Guest",
      selector: (row) => row?.id,
      sortable: true,
      cell: (row) => (
        <div className="Table_Item">
          <div>{row?.Adutls}</div>
          <div>{row?.Child}</div>
        </div>
      ),
    },
    {
      name: "Price",
      selector: (row) => row?.id,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.price}</div>,
    },
  ];
  let Tabs = [
    { title: "Approved", key: "approved" },
    { title: "Pending", key: "pending" },
    { title: "Cancelled", key: "cancelled" },
  ];
  return (
    <div className="BookingListKDk ">
      <DataTableComp data={data} columns={columns} tabs={Tabs} />
    </div>
  );
}

export default Index;
