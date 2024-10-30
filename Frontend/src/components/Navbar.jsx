import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import axios from "axios";
import Swal from "sweetalert2";
import PropTypes from "prop-types";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const Navbar = ({ jwt }) => {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [errors, setErrors] = useState({});
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setErrors({ keyword: "**Please enter a destination." });
      return;
    }
    try {
      const response = await axios.get(
        `https://travel-backend-fnyd.onrender.com/api/destination/?keyword=${keyword}`
      );
      if (response.status !== 200) {
        setErrors(response.data.errors);
      }
      console.log("response from navbar", response.data);
      navigate(`/package/${keyword}`);
    } catch (error) {
      console.log("Error fetching search results", error);
      Swal.fire("Enter something to search", "", "info");
    }
  };

  const handleKeywordChange = (e) => {
    setKeyword(e.target.value);
  };

  // Fetch user info
  useEffect(() => {
    const getUserById = async () => {
      if (!jwt) return;
      try {
        const response = await axios.get(
          "https://travel-backend-fnyd.onrender.com/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        if (response) {
          setUser(response.data);
        }
      } catch (error) {
        setUser(null);
        Swal.fire("Internal navbar Server Error", "", "error");
        console.log("internal navbar server error", error);
      }
    };
    getUserById();
  }, [jwt]);

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/signin");
  };

  return (
    <div className="flex justify-between items-center h-[5rem] max-w-full px-4 py-4 font-Montserrat cursor-pointer shadow-lg md:px-10">
      <div className="flex items-center gap-4 ">
        <Link to="/">
          <img src="logo.svg" alt="logo" className="w-[7.875rem] h-[3.2rem]" />
        </Link>
      </div>

      <div className="hidden md:flex border border-gray-300 shadow-lg w-[37.5rem] h-[3.125rem] rounded-full mt-2 justify-between items-center px-6 bg-white transition duration-300 hover:shadow-xl">
        <div className="w-[15.1875rem] h-[2.6875rem] m-0 border-gray-300 flex flex-col justify-center">
          <input
            type="text"
            placeholder="Search Destinations"
            onChange={handleKeywordChange}
            value={keyword}
            className="text-transform: capitalize w-full h-full rounded-sm px-4 focus:outline-none transition duration-200 border-gray-300 border-r-2"
          />
          {errors.keyword && (
            <p className="text-[#DF6951] font-poppins text-sm ml-2">
              {errors.keyword}
            </p>
          )}
        </div>
        <div className="relative flex items-center rounded-sm focus:outline-none px-5 py-2 transition duration-200 w-[12.3125rem] h-[2.375rem] bg-white">
          <select
            name="No. of Days"
            id="No. of Days"
            className="h-full appearance-none rounded-sm focus:outline-none pl-2 pr-8 cursor-pointer bg-white border-r-2"
          >
            <option value="" disabled selected>
              Select Days
            </option>
            <option value="1">1 Day</option>
            <option value="2">2 Days</option>
            <option value="3">3 Days</option>
            <option value="4">4 Days</option>
            <option value="5">5 Days</option>
          </select>
          <div className="absolute right-3">
            <IoIosArrowDown size={20} color="black" />
          </div>
        </div>
        <div className="w-[2.1875rem] h-[2.1875rem] ml-9 flex items-center justify-center bg-[#F18227] hover:bg-[#E0761F] rounded-full transition duration-300 transform hover:scale-105">
          <FaSearch onClick={handleSearch} size={18} color="white" />
        </div>
      </div>

      <div className="relative flex items-center w-[7.5rem] h-[3.125rem] gap-4 rounded-full justify-center py-3 hover:scale-105 transition duration-300 ">
        <Link to="/wishlist">
          <CiHeart size={38} color="black" />
        </Link>
        {user ? (
          <Avatar
            onClick={handleAvatarClick}
            sx={{ cursor: "pointer", backgroundColor: "#F18227" }}
          >
            {user.firstName.charAt(0).toUpperCase()}
          </Avatar>
        ) : (
          <Link to="/signin">
            <CgProfile size={30} color="black" />
          </Link>
        )}

        {/* Dropdown for Avatar */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          sx={{
            "& .MuiMenuItem-root": {
              // Style for MenuItem
              fontSize: "1rem",
              fontWeight: "500",
              fontFamily: "Poppins",
              color: "#7D7D7D",
              // border: "1px solid black",
              padding: "10px 20px", // Adjust padding
              "&:hover": {
                backgroundColor: "#F18227", // Change hover background color
                color: "white",
                width: "100%", // Change text color on hover
              },
            },
            "& .MuiPaper-root": {
              // Style for dropdown paper
              borderRadius: "8px", // Rounded corners
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              padding: "",
              width: "10rem",
              marginTop: "1rem",
              marginLeft: "4rem",
            },
          }}
        >
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
          <MenuItem>
            <Link to="/profile" className="w-full text-left">
              Profile
            </Link>
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

Navbar.propTypes = {
  jwt: PropTypes.string.isRequired, // jwt is a required string prop
};

export default Navbar;
