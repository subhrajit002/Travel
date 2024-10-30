import { useEffect, useState } from 'react'
import { Globe, Calendar, Settings, Menu, TrendingUp } from 'lucide-react'
import DashboardContent from './components/DashboardContent'
import DestinationsContent from './components/DestinationsContent'
import BookingsContent from './components/BookingContent'
import PropTypes from 'prop-types'
import AddDestination from './components/AddDestination'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { MenuItem, Menu as DropdownMenu } from '@mui/material'
import { CgProfile } from 'react-icons/cg'
import Swal from 'sweetalert2'

export default function TravelAdminPanel() {
  const [activePage, setActivePage] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);  // For dropdown handling
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const jwt = localStorage.getItem("token");

  useEffect(() => {
    const getUserById = async () => {
      if (!jwt) {
        navigate('/signin')
      };

      try {
        const response = await axios.get(
          "https://travel-backend-fnyd.onrender.com/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          }
        );
        if (jwt && response.data.role === "user") {
          Swal.fire("You are not authorized to that page", "", "warning");
          navigate('/')
        }
        else if (response) {
          setUser(response.data);
        }
      } catch (error) {
        setUser(null);
        // Swal.fire("Internal navbar Server Error", "", "error");
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
    localStorage.removeItem("token");
    navigate("/signin");
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardContent />;
      case "destinations":
        return <DestinationsContent />;
      case "bookings":
        return <BookingsContent />;
      case "addItem":
        return <AddDestination />;
      case "settings":
        return <SettingsContent />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`${isMobileMenuOpen ? 'block' : 'hidden'} w-64 bg-blue-800 text-white p-4 md:block`}>
        <h1 className="text-2xl font-bold mb-8">Travel Admin</h1>
        <nav>
          <ul className="space-y-2">
            <NavItem icon={<TrendingUp />} label="Dashboard" active={activePage === 'dashboard'} onClick={() => setActivePage('dashboard')} />
            <NavItem icon={<Globe />} label="Destinations" active={activePage === 'destinations'} onClick={() => setActivePage('destinations')} />
            <NavItem icon={<Calendar />} label="Bookings" active={activePage === 'bookings'} onClick={() => setActivePage('bookings')} />
            <NavItem icon={<ControlPointIcon />} label="Add Destinations" active={activePage === 'reviews'} onClick={() => setActivePage('addItem')} />
            <NavItem icon={<Settings />} label="Settings" active={activePage === 'settings'} onClick={() => setActivePage('settings')} />
          </ul>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <div className="flex items-center">
              <button
                className="md:hidden mr-2 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
                {activePage.charAt(0).toUpperCase() + activePage.slice(1)}
              </h2>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                {user ? (
                  // <Avatar
                  //     onClick={handleAvatarClick}
                  //     sx={{ cursor: "pointer", backgroundColor: "#F18227" }}
                  // >
                  //     {user.firstName.charAt(0).toUpperCase()}
                  // </Avatar>
                  <span
                    onClick={handleAvatarClick}
                    className="cursor-pointer font-medium text-gray-700 hover:text-gray-900"
                  >
                    Admin :   {user.firstName}
                  </span>

                ) : (
                  <Link to="/signin">
                    <CgProfile size={30} color="black" />
                  </Link>
                )}

                {/* Dropdown for Avatar */}
                <DropdownMenu
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
                      fontSize: "1rem",
                      fontWeight: "500",
                      fontFamily: "Poppins",
                      color: "#7D7D7D",
                      padding: "10px 20px",
                      "&:hover": {
                        backgroundColor: "#F18227",
                        color: "white",
                      },
                    },
                    "& .MuiPaper-root": {
                      borderRadius: "8px",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
                      marginTop: "1rem",
                      width: "10rem",
                    },
                  }}
                >
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <li>
      <button
        className={`flex items-center space-x-2 w-full p-2 rounded-lg ${active ? 'bg-blue-900 text-white' : 'text-blue-100 hover:bg-blue-700 hover:text-white'
          }`}
        onClick={onClick}
      >
        {icon}
        <span>{label}</span>
      </button>
    </li>
  )
}

function SettingsContent() {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Website Settings
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Manage your travel website settings and preferences.</p>
        </div>
        <form className="mt-5 space-y-6">
          {/* Form elements for settings */}
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}

NavItem.propTypes = {
  icon: PropTypes.node.isRequired,
  label: PropTypes.string.isRequired,
  active: PropTypes.bool,
  onClick: PropTypes.func.isRequired,
};
