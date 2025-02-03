import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';

const EventDetails = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [purchaseMessage, setPurchaseMessage] = useState(null);
    const [userName, setUserName] = useState("");
    const [ticket, setTicket] = useState(null);


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
    try {
      if (!userName.trim()) {
        setPurchaseMessage('Please enter a user name');
        return;
      }

      const response = await axios.post('http://localhost:5000/tickets', {
          eventId: id,
          user: userName,
        });

        setTicket(response.data)
        setPurchaseMessage('Ticket purchased successfully!');
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
        <button onClick={handlePurchase}>Purchase Ticket</button>
        {purchaseMessage && <p>{purchaseMessage}</p>}
         {ticket && (
              <div style={{ margin: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <img src={ticket.qrCode} alt="QR Code"/>
              </div>
            )}
    </div>
);
};

export default EventDetails;