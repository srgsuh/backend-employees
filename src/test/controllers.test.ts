import app from "../app.ts";
import request from "supertest";
import test from "node:test";
import {JestChaiExpect, JestExtend} from "@vitest/expect";
import * as chai from "chai";

chai.use(JestChaiExpect);
chai.use(JestExtend);
const expect = chai.expect;

const path = "/employees";
// Tokens generated with test secret key with a long expiration time
const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiVVNFUiIsImlhdCI6MTc1NTIxMTEyMiwiZXhwIjo0OTEwOTcxMTIyLCJzdWIiOiJ1c2VyQHVzZXIuY29tIn0.BRaj0CvgEU4sHfUe5WKv8qz6nz85z0lXJsh7tc2gE7Y";
const adminToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTUyMTExMzAsImV4cCI6NDkxMDk3MTEzMCwic3ViIjoiYWRtaW5AYWRtaW4uY29tIn0.IiOwf2toUMOYdVJvN9jHxlg8Dibt_Zmk1RRmhQWw8Ag";
const userAuthHeader = "Bearer " + userToken;
const adminAuthHeader = "Bearer " + adminToken;

const appRequest = request.agent(app);

const employee = {
    fullName: "John Doe",
    department: "IT",
    avatar: "",
    salary: 50_000,
    birthDate: "2000-01-01"
};

test("POST /login BAD credentials format -> 401", async () => {
    const expectedStatus = 401;
    const response = await appRequest
        .post("/login")
        .set("Accept", "application/json")
        .send({
            email: "email"
        });
    expect(response.statusCode).to.equal(expectedStatus);
});

test("POST /login Good credentials -> 200", async () => {
    const expectedStatus = 200;
    const response = await appRequest
        .post("/login")
        .set("Accept", "application/json")
        .send({
            email: "user@example.com",
            password: "password"
        });
    expect(response.statusCode).to.equal(expectedStatus);
    expect(response.body).to.be.an("object");
});

test(`GET ${path} w/o token -> 401`, async ()=> {
    const expectedStatus = 401;
    const response = await appRequest
        .get(path)
        .set("Accept", "application/json");

    expect(response.statusCode).to.equal(expectedStatus);
});

test(`GET ${path} with USER role -> 200`, async ()=> {
    const expectedStatus = 200;
    const response = await appRequest
            .get(path)
            .set("Accept", "application/json")
            .set('Authorization', userAuthHeader);

    expect(response.statusCode).to.equal(expectedStatus);
    expect(response.body).to.be.an("array");
});

test(`GET ${path} with ADMIN role -> 200`, async ()=> {
    const expectedStatus = 200;
    const response = await appRequest
        .get(path)
        .set("Accept", "application/json")
        .set('Authorization', adminAuthHeader);

    expect(response.statusCode).to.equal(expectedStatus);
    expect(response.body).to.be.an("array");
});

test(`GET ${path}/id w/o token -> 401`, async ()=> {
    const expectedStatus = 401;
    const response = await appRequest
        .get(`${path}/id`)
        .set("Accept", "application/json");

    expect(response.statusCode).to.equal(expectedStatus);
    expect(response.body).to.be.an("object");
});

test(`GET ${path}/id with USER role -> 200`, async ()=> {
    const expectedStatus = 200;
    const response = await appRequest
        .get(`${path}/id`)
        .set("Accept", "application/json")
        .set('Authorization', userAuthHeader);

    expect(response.statusCode).to.equal(expectedStatus);
    expect(response.body).to.be.an("object");
});

test(`GET ${path}/id with ADMIN role -> 200`, async ()=> {
    const expectedStatus = 200;
    const response = await appRequest
        .get(`${path}/id`)
        .set("Accept", "application/json")
        .set('Authorization', adminAuthHeader);

    expect(response.statusCode).to.equal(expectedStatus);
    expect(response.body).to.be.an("object");
});

test(`DELETE ${path}/id with USER role -> 403`, async ()=> {
    const expectedStatus = 403;
    const response = await appRequest
        .delete(`${path}/id`)
        .set("Accept", "application/json")
        .set('Authorization', userAuthHeader);

    expect(response.statusCode).to.equal(expectedStatus);
});

test(`DELETE ${path}/id with ADMIN role -> 200`, async ()=> {
    const expectedStatus = 200;
    const response = await appRequest
        .delete(`${path}/id`)
        .set("Accept", "application/json")
        .set('Authorization', adminAuthHeader);

    expect(response.statusCode).to.equal(expectedStatus);
    expect(response.body).to.be.an("object");
});

test(`POST add employee with USER role -> 403`, async ()=> {
    const expectedStatus = 403;
    const response = await appRequest
        .post(path)
        .send({})
        .set("Accept", "application/json")
        .set('Authorization', userAuthHeader);

    expect(response.statusCode).to.equal(expectedStatus);
});

test(`PATCH edit employee with USER role -> 403`, async ()=> {
    const expectedStatus = 403;
    const response = await appRequest
        .patch(`${path}/id`)
        .send({})
        .set("Accept", "application/json")
        .set('Authorization', userAuthHeader);

    expect(response.statusCode).to.equal(expectedStatus);
});

test(`POST add employee with ADMIN role -> 200`, async ()=> {
    const expectedStatus = 200;
    const response = await appRequest
        .post(path)
        .send(employee)
        .set("Accept", "application/json")
        .set('Authorization', adminAuthHeader);

    expect(response.statusCode).to.equal(expectedStatus, `response body: ${JSON.stringify(response.body, null, 2)}`);
    expect(response.body).to.be.an("object");
});

test(`PATCH edit employee with ADMIN role -> 200`, async ()=> {
    const expectedStatus = 200;
    const response = await appRequest
        .patch(`${path}/id`)
        .send({})
        .set("Accept", "application/json")
        .set('Authorization', adminAuthHeader);

    expect(response.statusCode).to.equal(expectedStatus, `response body: ${JSON.stringify(response.body, null, 2)}`);
    expect(response.body).to.be.an("object");
});