import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";

export default function AddDestination() {
  const [destination, setDestination] = useState({
    name: "",
    description: "",
    country: "",
    city: "",
    pricePerPerson: "",
    facilities: "",
    numberOfNights: "",
    images: [""],
    itinerary: [{ day: 1, activities: "" }],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDestination((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, index) => {
    const newImages = [...destination.images];
    newImages[index] = e.target.value;
    setDestination((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    setDestination((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index) => {
    const newImages = [...destination.images];
    newImages.splice(index, 1);
    setDestination((prev) => ({ ...prev, images: newImages }));
  };

  const handleItineraryChange = (e, index) => {
    const { name, value } = e.target;
    const newItinerary = [...destination.itinerary];
    newItinerary[index] = { ...newItinerary[index], [name]: value };
    setDestination((prev) => ({ ...prev, itinerary: newItinerary }));
  };

  const addItineraryDay = () => {
    setDestination((prev) => ({
      ...prev,
      itinerary: [
        ...prev.itinerary,
        { day: prev.itinerary.length + 1, activities: "" },
      ],
    }));
  };

  const removeItineraryDay = (index) => {
    const newItinerary = [...destination.itinerary];
    newItinerary.splice(index, 1);
    setDestination((prev) => ({ ...prev, itinerary: newItinerary }));
  };

  const jwt = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://travel-backend-fnyd.onrender.com/api/admin/add-destination",
        destination,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );
      console.log("added destination", response.data);
      if (response.status == 200)
        Swal.fire("Destination added successfully", "", "success");
    } catch (error) {
      if (error.response) {
        console.log("Server error:", error.response.data);
        Swal.fire(
          "Error adding destination",
          error.response.data.message || "An error occurred",
          "error"
        );
      }
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Add New Destination
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Enter the details for the new destination.
        </p>
      </div>
      <div className="border-t border-gray-200">
        <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Destination Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={destination.name}
                onChange={handleChange}
                className="px-2 py-1 mt-1 focus:ring-blue-500 focus:border-gray-300 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border"
                required
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="country"
                className="block text-sm font-medium text-gray-700"
              >
                Country
              </label>
              <input
                type="text"
                name="country"
                id="country"
                value={destination.country}
                onChange={handleChange}
                className="px-2 py-1 mt-1 focus:ring-blue-500 focus:border-gray-300 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border"
                required
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                name="city"
                id="city"
                value={destination.city}
                onChange={handleChange}
                className="px-2 py-1 mt-1 focus:ring-blue-500 focus:border-gray-300 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border"
                required
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="pricePerPerson"
                className="block text-sm font-medium text-gray-700"
              >
                Price Per Person
              </label>
              <input
                type="number"
                name="pricePerPerson"
                id="pricePerPerson"
                value={destination.pricePerPerson}
                onChange={handleChange}
                className="px-2 py-1 mt-1 focus:ring-blue-500 focus:border-gray-300 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border"
                required
              />
            </div>

            <div className="col-span-6">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={destination.description}
                onChange={handleChange}
                className="px-2 py-1 mt-1 focus:ring-blue-500 focus:border-gray-300 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border"
                required
              ></textarea>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="facilities"
                className="block text-sm font-medium text-gray-700"
              >
                Facilities
              </label>
              <input
                type="text"
                name="facilities"
                id="facilities"
                value={destination.facilities}
                onChange={handleChange}
                className="px-2 py-1 mt-1 focus:ring-blue-500 focus:border-gray-300 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border"
                required
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="numberOfNights"
                className="block text-sm font-medium text-gray-700"
              >
                Number of Nights
              </label>
              <input
                type="number"
                name="numberOfNights"
                id="numberOfNights"
                value={destination.numberOfNights}
                onChange={handleChange}
                className="px-2 py-1 mt-1 focus:ring-blue-500 focus:border-gray-300 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border"
                required
              />
            </div>

            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Images
              </label>
              {destination.images.map((image, index) => (
                <div key={index} className="flex mt-1">
                  <input
                    type="url"
                    value={image}
                    onChange={(e) => handleImageChange(e, index)}
                    className="focus:ring-blue-500 focus:border-gray-300 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border"
                    placeholder="Image URL"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    🗑
                  </button>
                  {index === destination.images.length - 1 && (
                    <button
                      type="button"
                      onClick={addImageField}
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Add Image
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700">
                Itinerary
              </label>
              {destination.itinerary.map((day, index) => (
                <div key={index} className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Day {day.day}
                  </label>
                  <textarea
                    name="activities"
                    value={day.activities}
                    onChange={(e) => handleItineraryChange(e, index)}
                    rows={2}
                    className="px-2 py-1 mt-1 focus:ring-blue-500 focus:border-gray-300 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border"
                    placeholder="Activities for this day"
                    required
                  ></textarea>
                  <button
                    type="button"
                    onClick={() => removeItineraryDay(index)}
                    className="mt-1 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    🗑 Remove Day
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addItineraryDay}
                className="mt-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add Itinerary Day
              </button>
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Destination
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
