import Card from "../components/WhyChooseUs/Card";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const PackageShowing = () => {
  const { id } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  // const jwt = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        try {
          const response = await axios.get(
            `https://travel-backend-fnyd.onrender.com/api/destination?keyword=${id}`
          );
          setSearchResults(response.data);
          console.log(response.data);
        } catch (error) {
          console.log("error while fetching the datas", error);
        }
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="flex flex-col">
      <div>
        <h1 className="text-3xl text-transform: capitalize font-bold ml-[6.8rem] pt-[1rem] mt-5">
          Results for {id}
        </h1>
      </div>

      {/* Display the search results */}
      <div className="ml-[6.8rem] pt-[5rem] mt-5 h-[91rem] w-[78.625rem] grid grid-cols-3 gap-2">
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
          <h1 className="text-2xl font-bold text-center font-poppins">
            No Trips Found
          </h1>
        )}
      </div>
    </div>
  );
};
/*

  Country,
  DiscountedPrice,
  price,
*/

export default PackageShowing;
