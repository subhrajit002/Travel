import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import BookingConfirmationModal from "./BookingConfirmationModal";
import PropTypes from "prop-types";


const BookingForm = ({ name, price }) => {
    const [user, setUser] = useState(null);
    const jwt = localStorage.getItem('token');

    //user profile
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

    //userbooking
    const { id } = useParams()
    const [userBooking, setUserBooking] = useState({
        name: '',
        email: '',
        bookingDate: '',
        numberOfPeople: 1,
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bookingDetails, setBookingDetails] = useState(null);

    const handleBooking = async (e) => {
        e.preventDefault()
        try {
            if (jwt) {
                const response = await axios.post(`https://travel-backend-fnyd.onrender.com/api/booking/create/${id}`, userBooking, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${jwt}`
                    }
                })

                console.log("booking", response.data)
                const { data } = response;
                if (response.status === 200) {
                    Swal.fire("Booked", "", "success");
                    setBookingDetails({
                        name: name,
                        price: price,
                        date: userBooking.bookingDate,
                        numberOfPeople: userBooking.numberOfPeople,
                        totalPrice: data.booking.totalPrice,
                        bookingId: data.booking._id 
                    });
                    
                    setIsModalOpen(true);
                }
            }
            else {
                Swal.fire("Need to login", "", "info")
            }
        } catch (error) {
            Swal.fire("Error while booking", "", "error")
            console.log("error while booking", error)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setUserBooking(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Book This Tour</h2>
            <form onSubmit={handleBooking}>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={`${user?.firstName || ''} ${user?.lastName || ''}`}
                        readOnly
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={user?.email || ''}
                        readOnly
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="bookingDate">
                        Date
                    </label>
                    <input
                        type="date"
                        id="bookingDate"
                        name="bookingDate"
                        value={userBooking.bookingDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="numberOfPeople">
                        Number of Guests
                    </label>
                    <input
                        type="number"
                        id="numberOfPeople"
                        name="numberOfPeople"
                        value={userBooking.numberOfPeople}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-[#DF6951] text-white py-2 px-4 rounded-md hover:bg-[#c85a45] transition-colors"
                >
                    Book Now
                </button>
            </form>
            {isModalOpen && bookingDetails && (
                <BookingConfirmationModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    bookingDetails={bookingDetails}
                />
            )}
        </div>
    );
}

BookingForm.propTypes = {
    name: PropTypes.string,
    price: PropTypes.number
};

export default BookingForm
