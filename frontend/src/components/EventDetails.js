import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams, useNavigate} from 'react-router-dom';
import {loadStripe} from '@stripe/stripe-js'
import {
    CardElement,
    Elements,
    useStripe,
    useElements
  } from '@stripe/react-stripe-js';

const EventDetails = () => {
    const { id } = useParams();
     const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [purchaseMessage, setPurchaseMessage] = useState(null);
    const [userName, setUserName] = useState("");
    const [ticket, setTicket] = useState(null);
     const stripe = useStripe();
      const elements = useElements();

    useEffect(() => {
    const fetchEvent = async () => {
        try {
        const response = await axios.get(`http://localhost:5000/events/${id}`);
        setEvent(response.data);
        } catch (error) {
        console.error('Error fetching event:', error);
        }
    };
    fetchEvent();
    }, [id]);

const handlePurchase = async () => {
    if (!stripe || !elements) {
          // Stripe.js has not loaded yet.
            // Make sure to disable form submission until Stripe.js has loaded.
          return;
        }
    try {
        if (!userName.trim()) {
            setPurchaseMessage('Please enter a user name');
            return;
        }
       const response = await axios.post('http://localhost:5000/tickets', {
           eventId: id,
           user: userName,
            });

          const cardElement = elements.getElement(CardElement);
            const {error, paymentMethod} = await stripe.createPaymentMethod({
                 type: 'card',
                 card: cardElement
            })

          if(error){
             setPurchaseMessage(error.message);
                return;
          }

            const paymentIntent = await axios.post('http://localhost:5000/payment', {
                amount: event.price * 100,
               payment_method: paymentMethod.id,
               ticketId: response.data._id
            });

            if(paymentIntent.data.success){
                setTicket(response.data)
                setPurchaseMessage('Ticket purchased successfully!');
                navigate(`/tickets/${response.data._id}`);
            }
            else{
                 setPurchaseMessage(paymentIntent.data.message);
            }


        } catch (error) {
            console.error('Error purchasing ticket:', error);
            setPurchaseMessage('Failed to purchase ticket. Please try again.');
        }
    };


    if (!event) {
    return <div>Loading...</div>;
    }

return (
    <div>
        <h2>{event.title}</h2>
        <p><strong>Description:</strong> {event.description}</p>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Venue:</strong> {event.venue}</p>
        <p><strong>Price:</strong> ${event.price}</p>
        <p><strong>Available Tickets:</strong> {event.availableTickets}</p>
         <input type="text" placeholder="User Name" value={userName} onChange={(e) => setUserName(e.target.value)} required />
       <Elements>
         <CardElement/>
        <button onClick={handlePurchase}>Purchase Ticket</button>
       </Elements>
        {purchaseMessage && <p>{purchaseMessage}</p>}
        </div>
);
};

export default EventDetails;