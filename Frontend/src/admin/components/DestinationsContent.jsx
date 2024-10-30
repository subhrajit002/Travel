import axios from "axios";
import PropTypes from "prop-types"
import { useEffect, useState } from "react";

export default function DestinationsContent() {
    const [destinations, setDestinations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("https://travel-backend-fnyd.onrender.com/api/destination/alldestinations");
            setDestinations(response.data);
            console.log("response", response.data);
        };
        fetchData();
    }, [])
    return (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Destinations</h3>
            </div>
            <div className="border-t border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nights</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    {destinations.length > 0 ? (
                        destinations.map((results) => (
                            <tbody key={results._id} className="bg-white divide-y divide-gray-200">
                                <DestinationRow name={results.name} country={results.country} nights={results.numberOfNights} price={results.pricePerPerson} activities={results.city} />
                            </tbody>
                        ))
                    ) : (
                        <h1 className="text-2xl font-bold text-center font-poppins">
                            No Trips Found
                        </h1>
                    )}

                </table>
            </div>
        </div>
    )
}

function DestinationRow({ name, country, activities, nights, price }) {
    return (
        <tr>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{country}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{activities}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap "> 
                <div className="text-sm text-gray-500">{nights}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{price}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <a href="#" className="text-blue-600 hover:text-blue-900 mr-4">Edit</a>
                <a href="#" className="text-red-600 hover:text-red-900">Delete</a>
            </td>
        </tr>
    );
}


DestinationRow.propTypes = {
    name: PropTypes.string,
    country: PropTypes.string,
    activities: PropTypes.string,
    nights: PropTypes.number,
    price: PropTypes.number,
};