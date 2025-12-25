const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getEvents, saveEvent, getRegistrations, saveRegistration } = require('../database-service');
const { authenticateToken, isAdmin } = require('../middleware/auth-middleware');

const router = express.Router();

// Get all events
router.get('/', async (req, res) => {
    try {
        const events = await getEvents();
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create event (Admin only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { title, date, description } = req.body;
        if (!title || !date) {
            return res.status(400).json({ error: 'Title and date required' });
        }

        const newEvent = {
            id: uuidv4(),
            title,
            date,
            description: description || ''
        };

        await saveEvent(newEvent);
        res.status(201).json(newEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update event (Admin only)
// Note: In a real app we'd need a way to update the file content properly without appending.
// For now, since saveEvent just appends, this is a limitation of the current JSON DB implementation.
// We'd need to rewrite the whole file. Let's assume saveEvent handles updates if we modify db.js or just implement a naive rewrite here.
// Actually, let's look at db.js... it just pushes. We need to fix db.js to support updates, or do it here.
// Let's implement full read-modify-write here for simplicity given db.js limitations.
const fs = require('fs/promises');
const path = require('path');
const EVENTS_FILE = path.join(__dirname, '../../../data/events.json');

router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, description } = req.body;

        let events = await getEvents();
        const index = events.findIndex(e => e.id === id);

        if (index === -1) {
            return res.status(404).json({ error: 'Event not found' });
        }

        events[index] = { ...events[index], title, date, description };

        // Direct write bypasses db.js append-only logic
        await fs.writeFile(EVENTS_FILE, JSON.stringify(events, null, 2));

        res.json(events[index]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        let events = await getEvents();
        const filteredEvents = events.filter(e => e.id !== id);

        if (events.length === filteredEvents.length) {
            return res.status(404).json({ error: 'Event not found' });
        }

        await fs.writeFile(EVENTS_FILE, JSON.stringify(filteredEvents, null, 2));
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Register for event (Authenticated users)
router.post('/register', authenticateToken, async (req, res) => {
    try {
        const { eventId } = req.body;
        const userId = req.user.id; // Get from token

        if (!eventId) {
            return res.status(400).json({ error: 'EventId required' });
        }

        // Check if already registered
        const regs = await getRegistrations();
        if (regs.find(r => r.userId === userId && r.eventId === eventId)) {
            return res.status(400).json({ error: 'Already registered' });
        }

        const newReg = {
            id: uuidv4(),
            userId,
            eventId,
            timestamp: new Date().toISOString()
        };

        await saveRegistration(newReg);
        res.status(201).json({ message: 'Registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
