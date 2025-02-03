import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useParams} from 'react-router-dom';

const TicketDetails = () => {
    const {id} = useParams();
    const [ticket, setTicket] = useState(null);

     useEffect(() => {
         const fetchTicket = async () => {
             try {
             const response = await axios.get(`http://localhost:5000/tickets/${id}`);
             setTicket(response.data);
            } catch (error) {
             console.error('Error fetching ticket:', error);
             }
        };
         fetchTicket();
        }, [id]);

    if (!ticket) {
            return <div>Loading...</div>;
        }

   return (
       <div>
         <h2>Your Ticket</h2>
         <div style={{ margin: '20px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
           <img src={ticket.qrCode} alt="QR Code"/>
         </div>
         <p><strong>Event:</strong> {ticket.event.title}</p>
         <p><strong>User:</strong> {ticket.user}</p>
       </div>
    );
};

export default TicketDetails;