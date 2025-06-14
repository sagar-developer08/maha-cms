import React, { lazy, useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "src/components/Layout/Layout";
import PrivateRoute from "src/components/Auth/PrivateRoute/Index";
import BaseRoute from "src/components/Auth/BaseRoute/Index";

// lazy load routes
// General
const Login = lazy(() => import("src/pages/Login"));
const Register = lazy(() => import("src/pages/Register"));
const ForgotPassword = lazy(() => import("src/pages/ForgetPassword"));
const Unauth = lazy(() => import("src/pages/Unauth"));
const Home = lazy(() => import("src/pages/Home"));
const NotFound = lazy(() => import("src/pages/NotFound"));

// admin
const DashboardAdmin = lazy(() => import("src/pages/Admin/DashboardAdmin"));
const BlogFormPage = lazy(() => import("src/pages/Admin/BlogForm"));
const BookingPageAd = lazy(() => import("src/pages/Admin/Booking"));
const BookingSlots = lazy(() => import("src/pages/Admin/BookingSlots"));
const PassengersList = lazy(() => import("src/pages/Admin/PassengersList"));
const BookingSlotForm = lazy(() => import("src/pages/Admin/BookingSlotForm"));
const PackagesPage = lazy(() => import("src/pages/Admin/Packages"));
const PackageFormPage = lazy(() => import("src/pages/Admin/PackageForm"));
const ClientListPage = lazy(() => import("src/pages/Admin/Client"));
const ClientFormPage = lazy(() => import("src/pages/Admin/ClientForm"));
const PaymentPage = lazy(() => import("src/pages/Admin/Payment"));
const MyAccountAdmin = lazy(() => import("src/pages/Admin/MyAccount"));
const BlogAdmin = lazy(() => import("src/pages/Admin/Blog"));

// customer
const DashboardCustomer = lazy(() =>
  import("src/pages/Customer/DashboardCustomer")
);
const BookingPage = lazy(() => import("src/pages/Customer/Booking"));
const MyAccount = lazy(() => import("src/pages/MyAccount"));

function NavRoutes() {
  return (
    <>
      <Routes>
        {/* general Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-passwaord" element={<ForgotPassword />} />

        <Route path="/:lang?/">
          <Route path="unauthorized" element={<Unauth />} />
        </Route>

        {/* Proected General Routes */}
        <Route
          path="/:lang?/"
          element={
            <PrivateRoute baseHome={true} roles={["admin", "customer"]}>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route exact index element={<BaseRoute baseHome={true} />} />
        </Route>

        {/* <Route
          path="/:lang?/admin"
          element={
            <PrivateRoute roles={["admin"]}>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route exact index element={<DashboardAdmin />} />
          <Route path="dashboard" element={<DashboardAdmin />} />
        </Route> */}
        {/* Admin Routes */}
        <Route
          path="/:lang?/admin"
          element={
            <PrivateRoute roles={["admin"]}>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route exact index element={<DashboardAdmin />} />
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="blogs/add" element={<BlogFormPage />} />
          <Route path="blogs/edit/:id" element={<BlogFormPage />} />
          <Route path="booking" element={<BookingPageAd />} />
          <Route path="packages" element={<PackagesPage />} />
          <Route path="package/add" element={<PackageFormPage />} />
          <Route path="package/edit/:id" element={<PackageFormPage />} />
          <Route path="passengers" element={<PassengersList />} />
          <Route path="booking-slots" element={<BookingSlots />} />

          <Route path="booking-slots/add" element={<BookingSlotForm />} />
          <Route path="booking-slots/edit/:id" element={<BookingSlotForm />} />
          <Route path="client" element={<ClientListPage />} />
          <Route path="client/add" element={<ClientFormPage />} />
          <Route path="client/edit/:id" element={<ClientFormPage />} />
          <Route path="client/view/:id" element={<ClientFormPage />} />
          <Route path="payments" element={<PaymentPage />} />
          <Route path="my-account" element={<MyAccountAdmin />} />
          <Route path="blog" element={<BlogAdmin />} />
        </Route>

        {/* customer Routes */}

        <Route
          path="/:lang?/customer"
          element={
            <PrivateRoute roles={["customer"]}>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route exact index element={<DashboardCustomer />} />
          <Route path="dashboard" element={<DashboardCustomer />} />
          <Route path="my-booking" element={<BookingPage />} />
          <Route path="my-account" element={<MyAccount />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default NavRoutes;
