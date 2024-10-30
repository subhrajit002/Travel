import axios from "axios";
import { Globe, Calendar, Users, IndianRupee } from "lucide-react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";

export default function DashboardContent() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total Bookings"
          value="3"
          icon={<Calendar className="h-8 w-8" />}
        />
        <DashboardCard
          title="Total Revenue"
          value=" ₹79,992"
          icon={<IndianRupee className="h-8 w-8" />}
        />
        <DashboardCard
          title="Active Users"
          value="4"
          icon={<Users className="h-8 w-8" />}
        />
        <DashboardCard
          title="Popular Destinations"
          value="3"
          icon={<Globe className="h-8 w-8" />}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentBookingsWidget />
        <TopDestinationsWidget />
      </div>
    </div>
  );
}

function DashboardCard({ title, value, icon }) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="rounded-md bg-blue-500 p-3">{icon}</div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm"></div>
      </div>
    </div>
  );
}

function RecentBookingsWidget() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://travel-backend-fnyd.onrender.com/api/admin/bookings"
        );
        setDestinations(response.data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Recent Bookings
        </h3>
        <a
          href="#"
          className="text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          View all
        </a>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {destinations.length > 0 ? (
            destinations
              .slice(0, 3)
              .map((result) => (
                <BookingItem
                  key={result._id}
                  customer={result.user.firstName}
                  destination={result.destination.city}
                  date={new Date(result.bookingDate).toLocaleDateString()}
                  amount={`₹ ${result.totalPrice}`}
                />
              ))
          ) : (
            <h1>No recent Booking</h1>
          )}
        </ul>
      </div>
    </div>
  );
}

function BookingItem({ customer, destination, date, amount }) {
  return (
    <li className="px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <CgProfile size={30} color="black" />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{customer}</div>
            <div className="text-sm text-gray-500">{destination}</div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="text-sm text-gray-500">{date}</div>
          <div className="ml-4 text-sm font-medium text-gray-900">{amount}</div>
        </div>
      </div>
    </li>
  );
}

function TopDestinationsWidget() {
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://travel-backend-fnyd.onrender.com/api/destination/alldestinations"
      );
      setDestinations(response.data);
      console.log("response", response.data);
    };
    fetchData();
  }, []);
  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Top Destinations
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {destinations.length > 0 ? (
            destinations.map((result) => (
              <DestinationItem
                key={result._id}
                name={result.name}
                country={result.country}
                bookings={120}
                revenue="₹ 145,000"
              />
            ))
          ) : (
            <h1>No destination</h1>
          )}
        </ul>
      </div>
    </div>
  );
}

function DestinationItem({ name, country, bookings, revenue }) {
  return (
    <li className="px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-gray-900">{name}</div>
          <div className="text-sm text-gray-500">{country}</div>
        </div>
        <div className="flex items-center">
          <div className="text-sm text-gray-500 mr-4">{bookings} bookings</div>
          <div className="text-sm font-medium text-gray-900">{revenue}</div>
        </div>
      </div>
    </li>
  );
}

DestinationItem.propTypes = {
  name: PropTypes.string,
  country: PropTypes.string,
  bookings: PropTypes.number,
  revenue: PropTypes.number,
};

BookingItem.propTypes = {
  customer: PropTypes.string,
  destination: PropTypes.string,
  date: PropTypes.number,
  amount: PropTypes.number,
};
DashboardCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  icon: PropTypes.number,
};
