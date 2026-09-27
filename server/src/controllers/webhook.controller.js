import Stripe from "stripe";
import { Order } from "../models/order.model.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error("Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        const orderId = session.client_reference_id || (session.metadata ? session.metadata.order_id : null);
        if (orderId) {
            try {
                await Order.findByIdAndUpdate(orderId, { payment_status: 'paid' });
                console.log(`Order ${orderId} payment_status updated to paid.`);
            } catch (dbError) {
                console.error("Error updating order:", dbError);
                return res.status(500).send('Database error');
            }
        }
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).send();
};
