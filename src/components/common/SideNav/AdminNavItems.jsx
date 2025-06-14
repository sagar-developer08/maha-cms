import { IoCopy } from "react-icons/io5";
import { FaCalendarAlt } from "react-icons/fa";
import { BsBox2Fill } from "react-icons/bs";
import { FaUserGroup } from "react-icons/fa6";
import { IoCard } from "react-icons/io5";
import { RiLayoutHorizontalFill } from "react-icons/ri";
import { FaUser } from "react-icons/fa";
import { IoIosBookmarks } from "react-icons/io";
import { FaBookmark } from "react-icons/fa6";
import { FaRegNewspaper } from "react-icons/fa";

let navItems = [
  {
    IconNav: <IoCopy size={25} />,
    title: "Dashboard",
    route: "/admin/dashboard",
  },
  {
    IconNav: <FaCalendarAlt size={25} />,
    title: "Booking",
    route: "/admin/booking",
  },
  {
    IconNav: <FaBookmark size={25} />,
    title: "Passengers Booking",
    route: "/admin/passengers",
  },
  {
    IconNav: <IoIosBookmarks size={25} />,
    title: "Booking Slots",
    route: "/admin/booking-slots",
  },
  {
    IconNav: <BsBox2Fill size={25} />,
    title: "Packages",
    route: "/admin/packages",
  },
  {
    IconNav: <FaUserGroup size={25} />,
    title: "Clients",
    route: "/admin/client",
  },
  {
    IconNav: <IoCard size={25} />,
    title: "Payments",
    route: "/admin/payments",
  },
  // {
  //   IconNav: <RiLayoutHorizontalFill size={25} />,
  //   title: "Pages",
  //   route: "/admin/pages",
  // },
  {
    IconNav: <FaUser size={25} />,
    title: "My Account",
    route: "/admin/my-account",
  },
  {
    IconNav: <FaRegNewspaper size={25} />,
    title: "Blog",
    route: "/admin/blog",
  },
];

export default navItems;
