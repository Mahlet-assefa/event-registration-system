import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import axios from 'axios';

export default function Dashboard() {
    const [events, setEvents] = useState([]);
    const { user } = useAuth();
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('/api/v1/events');
            setEvents(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRegister = async (eventId) => {
        if (!user) {
            setMessage('Please login to register');
            return;
        }
        try {
            await axios.post('/api/v1/events/register', { eventId });
            setMessage('Registration successful!');
        } catch (err) {
            setMessage(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Available Events</h1>
            {message && (
                <div className={`p-4 mb-4 rounded ${message.includes('successful') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {message}
                </div>
            )}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map(event => (
                    <div key={event.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200">
                        <h3 className="text-xl font-bold mb-2 text-gray-800">{event.title}</h3>
                        <p className="text-gray-600 mb-2">{new Date(event.date).toLocaleDateString()}</p>
                        <p className="text-gray-700 mb-4">{event.description}</p>
                        <button
                            onClick={() => handleRegister(event.id)}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                            disabled={!user}
                        >
                            {user ? 'Register' : 'Login to Register'}
                        </button>
                    </div>
                ))}
            </div>
            {events.length === 0 && <p className="text-center text-gray-500">No events found.</p>}
        </div>
    );
}
