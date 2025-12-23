import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
    const [events, setEvents] = useState([]);
    const [formData, setFormData] = useState({ title: '', date: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await axios.get('/api/v1/events');
            setEvents(res.data);
        } catch (err) {
            console.error('Failed to fetch events', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            if (editingId) {
                await axios.put(`/api/v1/events/${editingId}`, formData);
                setSuccess('Event updated successfully');
            } else {
                await axios.post('/api/v1/events', formData);
                setSuccess('Event created successfully');
            }
            fetchEvents();
            setFormData({ title: '', date: '', description: '' });
            setEditingId(null);
        } catch (err) {
            setError(err.response?.data?.error || 'Operation failed');
        }
    };

    const handleEdit = (event) => {
        setFormData({ title: event.title, date: event.date, description: event.description });
        setEditingId(event.id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;
        try {
            await axios.delete(`/api/v1/events/${id}`);
            fetchEvents();
            setSuccess('Event deleted successfully');
        } catch (err) {
            setError(err.response?.data?.error || 'Delete failed');
        }
    };

    const handleCancel = () => {
        setFormData({ title: '', date: '', description: '' });
        setEditingId(null);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Event' : 'Create New Event'}</h2>
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{success}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                            rows="3"
                        />
                    </div>
                    <div className="flex gap-4">
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                            {editingId ? 'Update Event' : 'Create Event'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {events.map((event) => (
                            <tr key={event.id}>
                                <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{new Date(event.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                    <button onClick={() => handleEdit(event)} className="text-blue-600 hover:text-blue-900">Edit</button>
                                    <button onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
