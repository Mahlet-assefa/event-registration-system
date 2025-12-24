const request = require('supertest');
const app = require('../index');
const fs = require('fs/promises');
const path = require('path');

const TEST_DATA_DIR = path.resolve(__dirname, './test-data');

beforeAll(async () => {
    process.env.DATA_PATH = './tests/test-data';
    await fs.mkdir(TEST_DATA_DIR, { recursive: true });
    await fs.writeFile(path.join(TEST_DATA_DIR, 'users.json'), '[]');
});

afterAll(async () => {
    await fs.rm(TEST_DATA_DIR, { recursive: true, force: true });
});

describe('Auth API', () => {
    const testUser = {
        username: 'testuser',
        password: 'password123'
    };

    it('should register a new user', async () => {
        const res = await request(app)
            .post('/api/v1/auth/register')
            .send(testUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('username', testUser.username);
    });

    it('should login the user', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send(testUser);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    it('should fail with invalid credentials', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ username: 'testuser', password: 'wrongpassword' });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('error', 'Invalid credentials');
    });
});
