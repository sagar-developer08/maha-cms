import React, { useState, useEffect } from "react";
import DataTableComp from "src/components/TableComp/Index";
import { Badge } from "react-bootstrap";
// api
import { getCustomerBookings } from "src/api/bookingAPI";
// css
import "./styels.scss";

function Index() {
  const userId = useSelector((state) => state?.auth?.userData?.id);
  const [bookingsData, setBookingsData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  // Fetch Booking Slots data from the API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await getCustomerBookings(userId);
      setBookingsData(data?.data);
    } catch (err) {
      console.error("Failed to fetch booking slots.", err);
      setError("Failed to fetch booking slots.", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchBookings();
  }, []);

  // Filter bookings based on active tab
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredData(bookingsData);
    } else {
      const filtered = bookingsData.filter(
        (booking) => booking?.status === activeTab
      );
      setFilteredData(filtered);
    }
  }, [activeTab, bookingsData]);

  let columns = [
    {
      name: "ID",
      selector: (row) => row?.id,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.id}</div>,
      maxWidth: "50px",
    },
    {
      name: "Package Type",
      selector: (row) => row?.id,
      sortable: true,
      minWidth: "350px",
      cell: (row) => (
        <div className="d-flex justify-content-start align-items-center">
          <img src={row?.slot?.tour?.package_image} height={80} width={80} />
          <div className="Table_Package Table_Item">
            {row?.slot?.tour?.title}
          </div>
        </div>
      ),
    },
    {
      name: "Date",
      selector: (row) => row?.id,
      sortable: true,
      minWidth: "120px",
      cell: (row) => <div className="Table_Item">{row?.slot?.date}</div>,
    },
    {
      name: "Time",
      selector: (row) => row?.id,
      sortable: true,
      cell: (row) => <div className="Table_Item">{row?.slot?.time}</div>,
    },
    // {
    //   name: "Guest",
    //   selector: (row) => row?.id,
    //   sortable: true,
    //   cell: (row) => (
    //     <div className="Table_Item">
    //       <div>{row?.Adutls}</div>
    //       <div>{row?.Child}</div>
    //     </div>
    //   ),
    // },
    {
      name: "User Details",
      selector: (row) => row?.id,
      sortable: true,
      minWidth: "350px",
      cell: (row) => (
        <div className="Table_Item">
          <ul className="pass_list">
            <li>
              <strong>Name:</strong> {row?.userDetails?.name}
            </li>
            <li>
              <strong>Email:</strong> {row?.userDetails?.email}
            </li>
            <li>
              <strong>Phone:</strong> {row?.userDetails?.phone}
            </li>
            <li>
              <strong>Weight:</strong> {row?.userDetails?.weight}
            </li>
          </ul>
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row?.id,
      sortable: true,
      cell: (row) => (
        <div className="Table_Item">
          <Badge
            pill
            bg={
              row?.status === "completed"
                ? "success"
                : row?.status === "pending"
                ? "warning"
                : row?.status === "approved"
                ? "info"
                : "danger"
            }
            className="text-capitalize"
          >
            {row?.status}
          </Badge>
        </div>
      ),
    },
    {
      name: "Price",
      selector: (row) => row?.id,
      sortable: true,
      minWidth: "120px",
      cell: (row) => <div className="Table_Item">AED {row?.subTotal}</div>,
    },
  ];

  let Tabs = [
    { title: "All", key: "all" },
    { title: "Approved", key: "approved" },
    { title: "Pending", key: "pending" },
    { title: "Cancelled", key: "cancelled" },
    { title: "Completed", key: "completed" },
  ];
  return (
    <div className="BookingTbld93L  mt-40">
      <DataTableComp
        data={data}
        columns={columns}
        tabs={Tabs}
        title="My Booking"
        setActiveTab={setActiveTab}
      />
    </div>
  );
}

export default Index;
