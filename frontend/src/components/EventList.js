import React from 'react';
import { Link } from 'react-router-dom';

const EventList = ({ events }) => {
    return (
        <div>
        <h2>Events</h2>
        <ul>
            {events.map((event) => (
            <li key={event._id}>
                <Link to={`/events/${event._id}`}>{event.title}</Link>
            </li>
            ))}
        </ul>
        </div>
    );
};

export default EventList;