const request = require('supertest');
const app = require('../app');
const sequelize = require('../database/config');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const httpMocks = require('node-mocks-http');
const { addDossier, updateDossier } = require('../controllers/medecinController.js');
const token = jwt.sign(
    {
        userInfos: {
            id: 11,
            email: 'davidperez@gmail.com',
            role: 'MEDECIN'
        }
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' }
);

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
describe('Medecin Routes', () => {
    it("should return my rdvs", async () => {
        const res = await request(app)
        .get('/medecin/getMyRdvs/11')
        .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    })
    it("should return dossiers patients", async () => {
        const res = await request(app)
        .get('/medecin/getDossierPatients/11')
        .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    })
    it("should return 404", async () => {
        const res = await request(app)
        .get('/medecin/nonExistentRoute')
        .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
    })
    it("should add a dossier", async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/medecin/addDossier',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {
                medecin_id: 11,
                patient_id: 3,
                titre: "Test Dossier",
            }
        });
        const res = httpMocks.createResponse();
        await addDossier(req, res);
        expect(res.statusCode).toBe(201);
    })
    it("should update a dossier", async () => {
        const req = httpMocks.createRequest({
            method: 'POST',
            url: '/medecin/updateDossier',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: {
                id: 2,
                observations: "Observations updated",
            }
        });
        const res = httpMocks.createResponse();
        await updateDossier(req, res);
        expect(res.statusCode).toBe(200);
    });
})