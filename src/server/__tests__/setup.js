const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Mock data directory for tests
const TEST_DATA_DIR = path.join(__dirname, '../../test-data');
const USERS_FILE = path.join(TEST_DATA_DIR, 'users.json');
const EVENTS_FILE = path.join(TEST_DATA_DIR, 'events.json');
const REGISTRATIONS_FILE = path.join(TEST_DATA_DIR, 'registrations.json');

// Set environment variable for data path to use test data
process.env.DATA_PATH = '../../test-data';
process.env.JWT_SECRET = 'test-secret-key';

// Helper to create valid tokens
global.createTestToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// Setup before all tests
beforeAll(() => {
    // Create test data directory if it doesn't exist
    if (!fs.existsSync(TEST_DATA_DIR)) {
        fs.mkdirSync(TEST_DATA_DIR, { recursive: true });
    }
});

// Setup before each test
beforeEach(() => {
    // Reset test data files to empty arrays
    fs.writeFileSync(USERS_FILE, '[]');
    fs.writeFileSync(EVENTS_FILE, '[]');
    fs.writeFileSync(REGISTRATIONS_FILE, '[]');
});

// Cleanup after all tests
afterAll(() => {
    // Optional: cleanup test directory
    // fs.rmSync(TEST_DATA_DIR, { recursive: true, force: true });
});
