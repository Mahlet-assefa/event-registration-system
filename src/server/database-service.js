const fs = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');

async function readJson(file) {
    try {
        const data = await fs.readFile(file, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist, return empty array
        if (error.code === 'ENOENT') {
            await fs.writeFile(file, '[]');
            return [];
        }
        throw error;
    }
}

async function writeJson(file, data) {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
}

module.exports = {
    getUsers: () => readJson(USERS_FILE),
    saveUser: async (user) => {
        const users = await readJson(USERS_FILE);
        users.push(user);
        await writeJson(USERS_FILE, users);
    },
    getEvents: () => readJson(EVENTS_FILE),
    saveEvent: async (event) => {
        const events = await readJson(EVENTS_FILE);
        events.push(event);
        await writeJson(EVENTS_FILE, events);
    },
    getRegistrations: () => readJson(REGISTRATIONS_FILE),
    saveRegistration: async (registration) => {
        const regs = await readJson(REGISTRATIONS_FILE);
        regs.push(registration);
        await writeJson(REGISTRATIONS_FILE, regs);
    }
};
