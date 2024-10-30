import { findBookingIdForPayment } from "./bookingController.js";
import { razorpay } from "../config/razorpayClient.js";
import User from "../models/userModels.js";


const createPaymentLink = async (req, res) => {
    const { id } = req.params;
    try {
        const booking = await findBookingIdForPayment(id);

        if (!booking) {
            return res.status(404).json({ message: "No Booking found with the given Id" });
        }

        const contactNumber = booking.user.mobile && /^[6-9]\d{9}$/.test(booking.user.mobile)
            ? booking.user.mobile
            : '9635877303'; // Replace this

        // Prepare the Razorpay payment link request
        const paymentLinkRequest = {
            amount: booking.totalPrice * 100,
            currency: "INR",
            customer: {
                name: `${booking.user.firstName} ${booking.user.lastName}`,
                email: booking.user.email,
                contact: booking.user.phone,
            },
            notify: {
                sms: true,
                email: true
            },
            callback_url: `https://travel-frontend-h669.onrender.com/payment/${id}`,
            callback_method: 'get',
        };

        const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);

        if (!paymentLink) {
            console.log("Error: Payment link not created.");
            return res.status(404).json({ message: "Error while creating the payment link" });
        }

        return res.status(200).json({
            paymentLinkId: paymentLink.id,
            payment_link_url: paymentLink.short_url,
        });
    } catch (error) {
        return res.status(500).json({ message: "Payment link is not created", error: error.message });
    }
};

const updatePaymentInfo = async (req, res) => {
    const { payment_id, order_id } = req.query;
    try {
        const booking = await findBookingIdForPayment(order_id);
        if (!booking) {
            return res.status(404).json({ message: "No Booking found with the given Id" });
        }

        const payment = await razorpay.payments.fetch(payment_id);
        if (payment.status === 'captured') {
            if (!booking.paymentDetails) {
                booking.paymentDetails = {};
            }

            if (booking.paymentDetails.status === "COMPLETED") {
                return res.status(400).json({ message: "Payment already completed" });
            }

            // Update payment details
            booking.paymentDetails.paymentId = payment_id;
            booking.paymentDetails.status = "COMPLETED";
            booking.status = "PLACED";

            await booking.save();

            const user = await User.findById(booking.user);
            if (user) {
                user.paymentInformation.push(booking._id);
                await user.save();
            }

            // Format the booking date
            const formattedBookingDate = booking.bookingDate ?
                new Date(booking.bookingDate).toLocaleDateString() :
                "N/A";

            return res.status(200).json({
                message: "PLACED",
                success: true,
                bookingDate: formattedBookingDate
            });
        } else {
            return res.status(400).json({ message: "Payment not captured. Status: " + payment.status });
        }
    } catch (error) {
        return res.status(500).json({ message: "Error while updating the payment details" });
    }
};





export { createPaymentLink, updatePaymentInfo }