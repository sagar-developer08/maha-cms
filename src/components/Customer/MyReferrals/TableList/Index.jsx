import React, { useEffect, useState } from "react";
import imgThumb from "src/assets/thumb.png";
import DataTable from "react-data-table-component";
import { useSelector } from "react-redux";
import { getreferralList } from "src/api/referenceAPI";

import "./styles.scss";
import moment from "moment";
function Index() {
  const userData = useSelector((state) => state.auth.userData);
  const [referalList, setReferalList] = useState([]);
  console.log("🚀 ~ Index ~ referalList:", referalList);
  const getRefletsList = async () => {
    try {
      const response = await getreferralList(userData?.id);
      console.log("Referal API: ", response);
      if (Array.isArray(response?.data?.user)) {
        setReferalList(response?.data?.user);
      } else {
        setReferalList([response?.data?.user]);
      }
    } catch (error) {
      console.log(error);
      console.log("Referal API Error: ", error);
    }
  };
  useEffect(() => {
    getRefletsList();
  }, []);

  let columns = [
    {
      name: "ID",
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.id}</div>,
      maxWidth: "120px",
    },

    {
      name: "Referral Name ",
      sortable: true,
      cell: (row) => (
        <div className="Table_Item">
          {row?.first_name} {row?.last_name}
        </div>
      ),
    },
    {
      name: "Date",
      sortable: true,
      cell: (row) => (
        <div className="Table_Item">
          {row?.updatedAt
            ? moment(row?.updatedAt).format("DD MMMM YYYY")
            : null}
        </div>
      ),
    },

    {
      name: "Email",
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.email}</div>,
    },
    {
      name: "UUID",
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.uuid}</div>,
    },
  ];
  return (
    <div className="TableReferrals39">
      <DataTable
        className="dataTable-custom"
        data={referalList}
        columns={columns}
        noHeader
        pagination
        subHeader
      />
    </div>
  );
}

export default Index;
