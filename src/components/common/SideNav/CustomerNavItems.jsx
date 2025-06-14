import { FaCalendarAlt, FaUser } from "react-icons/fa";
import { IoCopy } from "react-icons/io5";

let navItems = [
  {
    IconNav: <IoCopy size={25} />,
    title: "Dashboard",
    route: "/customer/dashboard",
  },
  // {
  //   IconNav: <FaCalendarAlt size={25} />,
  //   title: "Booking",
  //   route: "/customer/my-booking",
  // },
  {
    IconNav: <FaUser size={25} />,
    title: "My Account",
    route: "/customer/my-account",
  },
];

export default navItems;
