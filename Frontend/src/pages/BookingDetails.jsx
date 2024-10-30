import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Container,
    Paper,
    Typography,
    Box,
    Divider,
    Button,
    CircularProgress
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PropTypes from 'prop-types';

const BookingDetailsPage = () => {
    const { bookingId } = useParams(); // Extract bookingId from URL
    const queryParams = new URLSearchParams(window.location.search);
    const razorpay_payment_id = queryParams.get('razorpay_payment_id'); // Extract payment ID from query string
    const jwt = localStorage.getItem('token');
    const navigate = useNavigate();

    const [booking, setBooking] = useState(null);
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {

                const response = await axios.get(`https://travel-backend-fnyd.onrender.com/api/payment?payment_id=${razorpay_payment_id}&order_id=${bookingId}`, {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                });
                console.log("response", response.data)
                setBooking(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching booking details:", err);
                setError("Failed to load booking details. Please try again later.");
                setLoading(false);
            }
        };

        fetchBookingDetails();
    }, [bookingId, razorpay_payment_id]);


    //get the booking details
    useEffect(() => {
        const getBookingDetails = async () => {
            const response = await axios.get(`https://travel-backend-fnyd.onrender.com/api/booking/find/${bookingId}`,
                {
                    headers: {
                        Authorization: `Bearer ${jwt}`
                    }
                }
            );
            setDetails(response.data);
            // console.log("getting booking details", response.data)
        };
        getBookingDetails();
    }, [])


    useEffect(() => {

    })


    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container maxWidth="sm">
                <Typography variant="h6" color="error" align="center">
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md">
            <Paper elevation={3} sx={{ p: 4, mt: 4, mb: 4 }}>
                <Box display="flex" alignItems="center" mb={3}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
                    <Typography variant="h4" component="h1">
                        Booking Confirmed
                    </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                <Typography variant="h6" gutterBottom>
                    Booking Details
                </Typography>
                <Box my={2}>
                    <DetailItem label="Booking ID" value={bookingId || "N/A"} />
                    <DetailItem label="Tour" value={details.destination.name} />
                    <DetailItem label="Tour" value={details.destination.city} />
                    <DetailItem label="Tour" value={details.destination.country} />
                    <DetailItem label="Date" value={details?.bookingDate ? new Date(details.bookingDate).toLocaleDateString() : "N/A"} />
                    <DetailItem label="Number of People" value={details.numberOfPeople || "N/A"} />
                    <DetailItem label="Total Price" value={`₹${details.totalPrice.toLocaleString()}`} />
                </Box>

                <Divider sx={{ my: 3 }} />
                <Typography variant="h6" gutterBottom>
                    Payment Information
                </Typography>
                <Box my={2}>
                    <DetailItem label="Payment Status" value={booking.message} />
                </Box>
                <Box mt={4} display="flex" justifyContent="center">
                    <Button variant="contained" color="primary" onClick={() => window.print()}>
                        Print Booking Details
                    </Button>
                </Box>
                <Box mt={4} display="flex" justifyContent="center">
                    <Button variant="contained" color="primary" onClick={() => navigate("/")}>
                        HOME
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

const DetailItem = ({ label, value }) => (
    <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body1" color="text.secondary">{label}:</Typography>
        <Typography variant="body1" fontWeight="medium">{value}</Typography>
    </Box>
);

DetailItem.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.node.isRequired,
}

export default BookingDetailsPage;
