import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventDetails from './components/EventDetails';

function App() {
    return (
    <Router>
        <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events/:id" element={<EventDetails />} />
        </Routes>
    </Router>
    );
}

export default App;