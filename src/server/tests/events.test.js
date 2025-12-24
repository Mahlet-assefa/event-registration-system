const request = require('supertest');
const app = require('../index');
const fs = require('fs/promises');
const path = require('path');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth-middleware');

const TEST_DATA_DIR = path.resolve(__dirname, './test-data-events');

let adminToken;
let userToken;

beforeAll(async () => {
    process.env.DATA_PATH = './tests/test-data-events';
    await fs.mkdir(TEST_DATA_DIR, { recursive: true });
    await fs.writeFile(path.join(TEST_DATA_DIR, 'events.json'), '[]');
    await fs.writeFile(path.join(TEST_DATA_DIR, 'registrations.json'), '[]');
    await fs.writeFile(path.join(TEST_DATA_DIR, 'users.json'), '[]');

    adminToken = jwt.sign({ id: 'admin1', username: 'admin', isAdmin: true }, JWT_SECRET);
    userToken = jwt.sign({ id: 'user1', username: 'user', isAdmin: false }, JWT_SECRET);
});

afterAll(async () => {
    await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
});

describe('Events API', () => {
    let eventId;

    it('should create a new event (Admin)', async () => {
        const res = await request(app)
            .post('/api/v1/events')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({
                title: 'Test Event',
                date: '2025-12-30',
                description: 'Capacity test',
                capacity: 1
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        eventId = res.body.id;
    });

    it('should register for an event', async () => {
        const res = await request(app)
            .post('/api/v1/events/register')
            .set('Authorization', `Bearer ${userToken}`)
            .send({ eventId });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Registered successfully');
    });

    it('should fail when event is full (CR-001)', async () => {
        const otherUserToken = jwt.sign({ id: 'user2', username: 'user2', isAdmin: false }, JWT_SECRET);
        const res = await request(app)
            .post('/api/v1/events/register')
            .set('Authorization', `Bearer ${otherUserToken}`)
            .send({ eventId });

        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error', 'Event is full');
    });
});
