const request = require('supertest');
const app = require('../app');
const sequelize = require('../database/config');
const httpMocks = require('node-mocks-http');
const { signup, addAdmin, stats } = require('../controllers/userController.js');
const { askQuestion } = require('../chatBot.js');

let transaction;
beforeAll(async () => {
    await sequelize.authenticate();
});
beforeEach(async () => {
    transaction = await sequelize.transaction();
});
afterEach(async () => {
    await transaction.rollback();
});
afterAll(async () => {
    await sequelize.close();
});

describe('User Routes', () => {
    it('should return stats', async () => {
        const rest = await request(app)
        .get('/users/stats');
        expect(rest.statusCode).toBe(200);
    });
    it('should return 401', async () => {
        const res = await request(app)
        .get('/users/nonExistentRoute');
        expect(res.statusCode).toBe(401);
    });
    it('should signup a user', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/users/signup',
            body: {
                prenom: "signup test",
                nom: "test",
                email: "signup@test.com",
                password: "Test1234!",
            }
        });
        const res = httpMocks.createResponse();
        await signup(req, res);
        expect(res.statusCode).toBe(200);
    });
    it('should add admin', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/users/addAdmin',
            body: {
                prenom: "admin test",
                nom: "test",
                email: "admintest@test.com",
                password: "Test1234!",
            }
        });
        const res = httpMocks.createResponse();
        await addAdmin(req, res);
        expect(res.statusCode).toBe(200);
    });
    it('should return 200', async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/users/stats',
        });
        const res = httpMocks.createResponse();
        await stats(req, res);
        expect(res.statusCode).toBe(200);
    });
    it('should return 400 from chatbot', async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/users/chatbot',
        });
        const res = httpMocks.createResponse();
        await askQuestion(req, res);
        expect(res.statusCode).toBe(400);
    });
})