import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventDetails from './components/EventDetails';
import TicketDetails from './pages/TicketDetails';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login'


const stripePromise = loadStripe("your_stripe_public_key");

function App() {
    return (
    <Router>
        <Elements stripe={stripePromise}>
            <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route path="/tickets/:id" element={<TicketDetails />} />
            <Route path="/admin" element={<AdminDashboard/>} />
            <Route path="/login" element={<Login/>} />
            </Routes>
        </Elements>
    </Router>
    );
}

export default App;