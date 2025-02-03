import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventList from '../components/EventList';

const HomePage = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
    const fetchEvents = async () => {
        try {
        const response = await axios.get('http://localhost:5000/events');
        setEvents(response.data);
        } catch (error) {
        console.error('Error fetching events:', error);
        }
    };
    fetchEvents();
    }, []);

    return (
    <div>
        <EventList events={events} />
    </div>
    );
};

export default HomePage;