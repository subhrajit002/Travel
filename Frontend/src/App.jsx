import Homepage from "./components/Homepage";
import SignIn from "./pages/SIgnIn";
import SignUp from "./pages/SignUp";
import TopDestinations from "./components/WhyChooseUs/TopDestinations";
import { Routes, Route } from "react-router-dom";
import AdvertiseSection from "./components/FamousAttraction/AdvertiseSection";
import Footer from "./components/Footer/Footer";
import BookNextTrip from "./components/BookYourNextTrip/BookNextTrip";
import RecoveryPassword from "./pages/RecoveryPassword";
import ResetPassword from "./pages/ResetPassword";
import PackageShowing from "./pages/PackageShowing";
import PackageInfo from "./pages/PackageInfo";
import TravelForm from "./components/OrderForm/Form";
import Wishlist from "./pages/Wishlist";
import Orders from "./pages/Orders";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import axios from "axios";
import Swal from "sweetalert2";
import Profile from "./pages/Profile";
import Admin from "./admin/Admin";
import BookingDetailsPage from "./pages/BookingDetails";

import TourPlan from "./components/TourPlan";
function App() {
  const jwt = localStorage.getItem("token");

  
  useEffect(() => {
    const verifyUser = async () => {
      try {
        console.log("JWT Token:", jwt);

        const response = await axios.get(
          "https://travel-backend-fnyd.onrender.com/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );

        if (response.status !== 200) {
          Swal.fire("You need to login", "", "question");
        }
      } catch (error) {
        console.error("Error verifying user:", error);
      }
    };
    verifyUser();
  }, []);

  return (
    <div className="overflow-x-hidden font-poppins">
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Navbar jwt={jwt} />
              <Homepage />
              <TopDestinations />
              <AdvertiseSection />
              <BookNextTrip />
              <Footer />
            </div>
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/recover_password" element={<RecoveryPassword />} />
        <Route path="/reset_password" element={<ResetPassword />} />
        <Route path="/orderform" element={<TravelForm />} />
        <Route
          path="/package/:id"
          element={
            <>
              <Navbar jwt={jwt} />
              <PackageShowing />
              <Footer />
            </>
          }
        />
        <Route path="/package/packageinfo/:id" element={<PackageInfo />} />
        <Route
          path="/package/:id/packageinfo/tourplan"
          element={<TourPlan />}
        />
        <Route
          path="/wishlist"
          element={
            <>
              <Navbar jwt={jwt} />
              <Wishlist />
              <Footer />
            </>
          }
        />
        <Route
          path="/orders"
          element={
            <>
              <Navbar jwt={jwt} />
              <Orders />
              <Footer />
            </>
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/payment/:bookingId" element={<BookingDetailsPage />} />

      </Routes>
    </div>
  );
}
export default App;
