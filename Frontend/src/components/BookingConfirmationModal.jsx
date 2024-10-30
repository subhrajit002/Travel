
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import axios from 'axios';

const StyledDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(3),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(2),
    },
}));

const BookingConfirmationModal = ({ isOpen, onClose, bookingDetails }) => {

    const jwt = localStorage.getItem('token')

    const handlePaymentClick = async () => {
        const response = await axios.post(
            `https://travel-backend-fnyd.onrender.com/api/payment/${bookingDetails.bookingId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            }
        );
        if (response.data.payment_link_url) {
            window.location.href = response.data.payment_link_url;
        }
        console.log("Proceeding to payment...", response.data);
        onClose();
    };


    return (
        <StyledDialog
            open={isOpen}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                <Box display="flex" alignItems="center">
                    <CheckCircleOutlineIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Booking Confirmation
                    </Typography>
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            color: (theme) => theme.palette.grey[300],
                            '&:hover': {
                                color: (theme) => theme.palette.common.white,
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>

            <DialogContent dividers>
                <Typography variant="subtitle1" gutterBottom>
                    Your booking has been confirmed. Here are the details:
                </Typography>
                <Box my={2}>
                    <DetailItem label="Tour" value={bookingDetails.name} />
                    <DetailItem label="Date" value={new Date(bookingDetails.date).toLocaleDateString()} />
                    <DetailItem label="Price" value={`₹${bookingDetails.price.toLocaleString()}`} />
                    <DetailItem label="Number of People" value={bookingDetails.numberOfPeople} />
                    <DetailItem label="Total Price" value={`₹${bookingDetails.totalPrice}`} />

                </Box>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={handlePaymentClick}
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{
                        py: 1.5,
                        fontSize: '1.1rem',
                        textTransform: 'none'
                    }}
                >
                    Proceed to Payment
                </Button>
            </DialogActions>
        </StyledDialog>
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
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

BookingConfirmationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    bookingDetails: PropTypes.shape({
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        numberOfPeople: PropTypes.number.isRequired,
        totalPrice: PropTypes.number.isRequired,
        bookingId: PropTypes.number.isRequired,
    }).isRequired,
};

export default BookingConfirmationModal;