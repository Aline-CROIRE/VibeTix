import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [events, setEvents] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [message, setMessage] = useState('');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();


    useEffect(() => {
      fetchEvents();
      fetchTickets();
    }, []);

    const fetchEvents = async () => {
        try {
          const response = await axios.get('http://localhost:5000/admin/events', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setEvents(response.data);
        } catch (error) {
           console.error('Error fetching events:', error);
          if (error.response && error.response.data && error.response.data.message) {
             setMessage(error.response.data.message);
          } else {
            setMessage("An error occurred");
          }
       }
    };

    const fetchTickets = async () => {
        try {
          const response = await axios.get('http://localhost:5000/admin/tickets', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
            setTickets(response.data);
        } catch (error) {
          console.error('Error fetching tickets:', error);
         if (error.response && error.response.data && error.response.data.message) {
             setMessage(error.response.data.message);
         } else {
           setMessage("An error occurred");
         }
      }
    };

    const handleCreateEvent = async () => {
       try {
            const newEvent = {
                title: 'New Event',
                description: 'A new event to test',
                date: new Date(),
                venue: 'Some Place',
                totalTickets: 100,
                price: 20
               }
            await axios.post('http://localhost:5000/admin/events',newEvent, {
              headers: {
                    Authorization: `Bearer ${token}`,
                   'Content-Type': 'application/json',
                },
              })

               fetchEvents()
               setMessage("New Event created");
          }
       catch(error){
         if (error.response && error.response.data && error.response.data.message) {
             setMessage(error.response.data.message);
         } else {
           setMessage("An error occurred");
         }
       }
    }
    const handleRemoveEvent = async (id) => {
        try{
          await axios.delete(`http://localhost:5000/admin/events/${id}`,{
            headers: {
               Authorization: `Bearer ${token}`,
            },
          })
          fetchEvents();
           setMessage("Event deleted");
         }
         catch(error){
             if (error.response && error.response.data && error.response.data.message) {
                setMessage(error.response.data.message);
             } else {
                 setMessage("An error occurred");
             }
         }
    }

   const handleRemoveTicket = async (id) => {
         try{
            await axios.delete(`http://localhost:5000/admin/tickets/${id}`,{
             headers: {
                Authorization: `Bearer ${token}`,
              },
           })
           fetchTickets();
            setMessage("Ticket deleted");
        }
        catch(error){
           if (error.response && error.response.data && error.response.data.message) {
               setMessage(error.response.data.message);
            } else {
              setMessage("An error occurred");
           }
        }
    }
    const handleLogout = () => {
            localStorage.removeItem('token');
             navigate('/');
    }

    if(message){
        setTimeout(() => {
             setMessage('');
        }, 3000);
    }


    return (
        <div>
           <h2>Admin Dashboard</h2>
           {message && <p>{message}</p>}
           <button onClick={handleLogout}>Logout</button>

           <h3>Events</h3>
            <button onClick={handleCreateEvent}>Create Event</button>
            <ul>
              {events.map(event => (
                <li key={event._id}>
                   {event.title} - {event.availableTickets} available tickets
                   <button onClick={() => handleRemoveEvent(event._id)}>Remove</button>
                </li>
                ))}
            </ul>

            <h3>Tickets</h3>
            <ul>
                {tickets.map(ticket => (
                    <li key={ticket._id}>
                        {ticket.event.title} - {ticket.user}
                     <button onClick={() => handleRemoveTicket(ticket._id)}>Remove</button>
                    </li>
                ))}
            </ul>
      </div>
    );
};

export default AdminDashboard;