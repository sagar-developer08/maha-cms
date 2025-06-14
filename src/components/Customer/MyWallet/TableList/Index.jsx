import React from "react";
import imgThumb from "src/assets/thumb.png";
import DataTable from "react-data-table-component";

import "./styles.scss";
function Index(props) {
  const { commissiondata } = props;
  let columns = [
    {
      name: "Direct Commission",
      sortable: true,
      cell: (row) => (
        <div className="Table_Item">
          {parseInt(row?.directCommission)?.toFixed(0)}
        </div>
      ),
    },

    {
      name: "L1 Commission ",
      sortable: true,
      cell: (row) => (
        <div className="Table_Item">
          {parseInt(row?.l1Commission)?.toFixed(0)}
        </div>
      ),
    },
    {
      name: "L2 Commission",
      sortable: true,
      cell: (row) => (
        <div className="Table_Item">
          {parseInt(row?.l2Commission)?.toFixed(0)}
        </div>
      ),
    },
  ];
  let columns2 = [
    {
      name: "Direct Sales",
      sortable: true,
      cell: (row) => (
        <div className="Table_Item">
          {parseInt(row?.directSales)?.toFixed(0)}
        </div>
      ),
    },

    {
      name: "Level 1 Sales ",
      sortable: true,
      cell: (row) => (
        <div className="Table_Item">
          {parseInt(row?.level1Sales)?.toFixed(0)}
        </div>
      ),
    },
    {
      name: "Level 2 Sales",
      sortable: true,
      cell: (row) => (
        <div className="Table_Item">
          {parseInt(row?.level2Sales)?.toFixed(0)}
        </div>
      ),
    },
  ];
  return (
    <div className="TableWallet39">
      {commissiondata?.breakdown ? (
        <>
          <div className="form-title">Break Down</div>
          <DataTable
            className="dataTable-custom"
            data={[commissiondata?.breakdown]}
            columns={columns}
            noHeader
            pagination
            subHeader
          />
        </>
      ) : null}
      {commissiondata?.totalSales ? (
        <>
          <div className="form-title">Total Sales</div>
          <DataTable
            className="dataTable-custom"
            data={[commissiondata?.totalSales]}
            columns={columns2}
            noHeader
            pagination
            subHeader
          />
        </>
      ) : (
        "No Total Sales Found"
      )}
    </div>
  );
}

export default Index;
