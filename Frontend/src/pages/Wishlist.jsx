import { useEffect, useState } from "react";

import Card from "../components/WhyChooseUs/Card";
import axios from "axios";


const Wishlist = () => {
  const jwt = localStorage.getItem("token");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("https://travel-backend-fnyd.onrender.com/api/user/favorites",
        {
          headers: {
            Authorization: `Bearer ${jwt}`
          }
        }
      );
      setSearchResults(response.data);
      console.log("user favorities", response.data);
    }
    fetchData();
  }, [jwt])

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="w-[90%] max-h-full min-h-screen mx-auto mt-10 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold p-5 text-[#DF6951] font-poppins">
          Your Dreamed Destinations
        </h1>


        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 px-3 mt-10 pl-10 mb-10">
          {searchResults.length > 0 ? (
            searchResults.map((result) => (
              <Card
                key={result._id}
                _id={result._id}
                src={result.images[0]}
                Days={result.numberOfNights}
                price={result.pricePerPerson}
                City={result.name}
                Country={result.country}
              />
            ))
          ) : (
            <h1 className="text-2xl font-bold">Hurry up & add your destination</h1>
          )}
        </div>
      </div>
    </div>
  );
};
export default Wishlist;
