const request = require('supertest');
const app = require('../app');
const sequelize = require('../database/config');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');
const { testLogged } = require('../controllers/userController.js');
const { me, getDataforRdv } = require('../controllers/authController.js');

const token = jwt.sign(
    {
        userInfos: {
            id: 4,
            email: 'jonhdoe@gmail.com',
            role: 'PATIENT'
        }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
);

let transaction;
beforeAll(async () => {
    await sequelize.authenticate();
});
beforeEach(async () => {
});
afterEach(async () => {
});
afterAll(async () => {
    await sequelize.close();
});

describe('Auth Routes', () => {
    it('should return 200 for logged user', async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/users/testLogged',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const res = httpMocks.createResponse();
        await testLogged(req, res);
        expect(res.statusCode).toBe(200);
    });

    it('should return my infos', async  () => {
        const res = await request(app)
        .get('/auth/me/4')
        .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    })
    it("should return data for appointments", async () => {
        const req = httpMocks.createRequest({
            method: 'GET',
            url: '/auth/getDataForRdv/',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        const res = httpMocks.createResponse();
        await getDataforRdv(req, res);
        expect(res.statusCode).toBe(200);
    })
});
