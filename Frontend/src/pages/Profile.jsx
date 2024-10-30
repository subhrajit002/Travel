import {
  FiSettings,
  FiEdit,
  FiUser,
  FiCreditCard,
  FiGlobe,
  FiMapPin,
} from "react-icons/fi";
import { IoHomeOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { FaPlane } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";


export default function Profile() {
  const jwt = localStorage.getItem("token");
  const [user, setUser] = useState({});

  //profile
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("https://travel-backend-fnyd.onrender.com/api/user/profile",
        {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        }
      );
      setUser(response.data)
      console.log("user profile", response.data);
    }
    fetchData();
  }, [jwt])


  const [activeTab, setActiveTab] = useState("personal");
  const formatDate = (createAt) => {
    const date = new Date(createAt);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  //update user
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })
  const handleInput = (event) => {
    setValues((prev) => (
      {
        ...prev,
        [event.target.name]: event.target.value
      }
    ))
  }
  const handleUpdate = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.put("https://travel-backend-fnyd.onrender.com/api/user/updateuser", values, {
        headers: {
          Authorization: `Bearer ${jwt}`
        }
      });
      if (response.status === 200) {
        Swal.fire("User Updated successfully", "", "success").then(() => {
          setTimeout(() => {
            location.reload();
          }, 1000);
        })
      }
    } catch (e) {
      if (e.response && e.response.status === 400) {
        Swal.fire("User already exists with the email", "", "info")
      }
      console.log("error while updating", e)
    }
  }


  //upcoming trips
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    const fetchBookings = async () => {
      const response = await axios.get("https://travel-backend-fnyd.onrender.com/api/user/bookings", {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
      console.log("bookings", response.data)
      setBookings(response.data);
    };

    fetchBookings();
  }, [jwt]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 lg:p-8 font-poppins">
      <div className="max-w-6xl mx-auto">

        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-[#ff694b] flex items-center justify-center text-white text-2xl font-bold">
              {user.firstName ? user.firstName.charAt(0).toUpperCase() : "?"}
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome, {user.firstName}
              </h1>
              <p className="text-gray-600">
                Member since {user.createAt ? formatDate(user.createAt) : "N/A"}              </p>
            </div>
          </div>
          <button className="px-4 py-2 border rounded-md flex items-center space-x-2">
            <FiSettings className="w-4 h-4" />
            <span>Account Settings</span>
          </button>
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="w-full">
              <div className="flex space-x-4 mb-4">
                <button
                  className={`py-2 px-4 ${activeTab === "personal"
                    ? "bg-[#ff694b] text-white"
                    : "bg-gray-200"
                    }`}
                  onClick={() => setActiveTab("personal")}
                >
                  Personal
                </button>
                <button
                  className={`py-2 px-4 ${activeTab === "upcoming"
                    ? "bg-[#ff694b] text-white"
                    : "bg-gray-200"
                    }`}
                  onClick={() => setActiveTab("upcoming")}
                >
                  Upcoming
                </button>
                <button
                  className={`py-2 px-4 ${activeTab === "past"
                    ? "bg-[#ff694b] text-white"
                    : "bg-gray-200"
                    }`}
                  onClick={() => setActiveTab("past")}
                >
                  Past Trips
                </button>
                <button
                  className={`py-2 px-4 ${activeTab === "preferences"
                    ? "bg-[#ff694b] text-white"
                    : "bg-gray-200"
                    }`}
                  onClick={() => setActiveTab("preferences")}
                >
                  Preferences
                </button>
              </div>
              {activeTab === "personal" && (
                <form onSubmit={handleUpdate}  >
                  <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">
                      Personal Information
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="fullName">First Name</label>
                        <input
                          id="firstName"
                          type="text"
                          placeholder={user.firstName}
                          className="border p-2 rounded w-full"
                          onChange={handleInput}
                          name="firstName"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="fullName">Last Name</label>
                        <input
                          id="lastName"
                          type="text"
                          placeholder={user.lastName}
                          className="border p-2 rounded w-full"
                          onChange={handleInput}
                          name="lastName"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="fullName">Email</label>
                        <input
                          id="email"
                          type="text"
                          placeholder={user.email}
                          className="border p-2 rounded w-full"
                          onChange={handleInput}
                          name="email"
                        />
                      </div>
                      <div className="space-y-2 mt-9 ml-5">
                        <Link to="/recover_password" className="opacity-70 ">
                          Click to change password
                        </Link>
                      </div>
                    </div>
                    <button type="submit" className="mt-4 px-4 py-2 bg-[#ff694b] text-white rounded flex items-center space-x-2">
                      <FiEdit className="w-4 h-4" />
                      <span>Update Information</span>
                    </button>
                  </div>
                </form>

              )}



              {activeTab === "upcoming" && (
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Upcoming Trips</h2>
                  <div className="space-y-4">
                    {bookings.map((booking) => {
                      const bookingDate = new Date(booking.bookingDate);

                      if (isNaN(bookingDate.getTime())) {
                        console.error("Invalid booking date:", booking.bookingDate);
                        return null; 
                      }

                      const endDate = new Date(bookingDate);
                      endDate.setDate(bookingDate.getDate() + booking.destination.numberOfNights);

                      // Format the start and end dates
                      const formattedStartDate = formatDate(bookingDate);
                      const formattedEndDate = formatDate(endDate);

                      // Create the combined date string without extra commas
                      const dateRange = `${formattedStartDate.split(' ')[0]} ${formattedStartDate.split(' ')[1]}-${formattedEndDate.split(' ')[1]}, ${formattedEndDate.split(' ')[2]}`;

                      return (
                        <div key={booking._id} className="flex items-center justify-between p-4 bg-gray-100 rounded">
                          <div>
                            <h3 className="font-semibold">{booking.destination.name}</h3>
                            <p className="text-gray-600">{booking.destination.city} {booking.destination.country}</p>
                          </div>
                          <div className="text-right">
                            <p>{dateRange}</p>
                            <Link to={`/orders/${booking._id}`}>
                              <button className="text-[#ff694b]">View Details</button>
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}





              {activeTab === "past" && (
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Past Trips</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-100 rounded">
                      <div>
                        <h3 className="font-semibold">Jaipur, the Pink City</h3>
                        <p className="text-gray-600">Jaipur, India</p>
                      </div>
                      <div className="text-right">
                        <p>September 10 - 17, 2024</p>
                        <button className="text-[#ff694b]">View Photos</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-100 rounded">
                      <div>
                        <h3 className="font-semibold">
                          Agra, the City of Taj Mahal
                        </h3>
                        <p className="text-gray-600">Agra, India</p>
                      </div>
                      <div className="text-right">
                        <p>April 5 - 15, 2024</p>
                        <button className="text-[#ff694b]">View Photos</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "preferences" && (
                <div className="bg-white p-4 rounded-lg shadow">
                  <h2 className="text-xl font-bold mb-4">Travel Preferences</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block mb-2">Preferred Transport</label>
                      <select className="w-full p-2 border rounded">
                        <option>Car</option>
                        <option>Bus</option>
                        <option>Train</option>
                        <option>Flight</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2">Seat Preference</label>
                      <select className="w-full p-2 border rounded">
                        <option>Window</option>
                        <option>Aisle</option>
                        <option>Middle</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2">Meal Preference</label>
                      <select className="w-full p-2 border rounded">
                        <option>Regular</option>
                        <option>Vegetarian</option>
                        <option>Vegan</option>
                        <option>Kosher</option>
                        <option>Halal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2">Room Preference</label>
                      <select className="w-full p-2 border rounded">
                        <option>Non-Smoking</option>
                        <option>Smoking</option>
                        <option>High Floor</option>
                        <option>Low Floor</option>
                      </select>
                    </div>
                  </div>
                  <button className="mt-4 px-4 py-2 bg-[#fc5736] text-white rounded">
                    Save Preferences
                  </button>
                </div>
              )}
            </div>
            <Link to="/">
              <div className="flex items-center gap-2 bg-[#ff694b] text-white px-4 py-2 rounded-md mt-10">
                <button className="">Back to Home</button>
                <IoHomeOutline />
              </div>
            </Link>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <button className="w-full px-4 py-2 border rounded-md flex items-center space-x-2">
                  <FaPlane className="w-4 h-4" />
                  <Link to="/">
                    {" "}
                    <span>Book a New Trip</span>
                  </Link>
                </button>
                <button className="w-full px-4 py-2 border rounded-md flex items-center space-x-2">
                  <FiCreditCard className="w-4 h-4" />
                  <span>Manage Payment Methods</span>
                </button>
                <button className="w-full px-4 py-2 border rounded-md flex items-center space-x-2">
                  <FiUser className="w-4 h-4" />
                  <span>Update Profile</span>
                </button>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4">Extra Info</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex gap-2 items-center">
                    <FiGlobe className="w-4 h-4 text-[#ff694b]" />
                    Cities Visited
                  </span>
                  <span className="font-semibold">{user.paymentInformation ? user.paymentInformation.length : 0}</span>
                </div>
                <Link to="/wishlist">
                  <div className="flex mt-2 items-center justify-between">
                    <span className="flex gap-2 items-center">
                      <FiMapPin className="w-4 h-4 text-[#ff694b]" />
                      Total Favs
                    </span>
                    <span className="font-semibold">{user.favorites ? user.favorites.length : 0}</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
}
