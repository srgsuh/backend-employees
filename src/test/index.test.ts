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

test("OPTIONS /login -> 204", async () => {
    const response = await request(app)
        .options("/login")
        .set('Accept', '*/*')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'content-type');
    expect(response.statusCode).to.equal(204);
    expect(response.headers)
        .to.have.property("access-control-allow-origin")
        .that.is.not.undefined;
    expect(response.headers)
        .to.have.property("access-control-allow-headers")
        .that.is.not.undefined;
    expect(response.headers)
        .to.have.property("access-control-allow-methods")
        .that.includes("POST");
})

test("POST /login BAD credentials format -> 400", async () => {
    const response = await request(app)
        .post("/login")
        .set('Accept', 'application/json')
        .send({
            email: "email"
        });
    expect(response.statusCode).to.equal(400);
});

test("POST /login Good credentials -> 200", async () => {
    const response = await request(app)
        .post("/login")
        .set('Accept', 'application/json')
        .send({
            email: "user@example.com",
            password: "password"
        });
    expect(response.statusCode).to.equal(200);
    expect(response.body).to.be.an("object");
});

test(`GET ${path} w/o token -> 401`, async ()=> {
    const response = await request(app)
        .get("/employees")
        .set('Accept', 'application/json');

    expect(response.statusCode).to.equal(401);
});

test(`GET ${path} with USER role -> 200`, async ()=> {
    const response = await request(app)
            .get("/employees")
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${userToken}`);

    expect(response.statusCode).to.equal(200);
    expect(response.body).to.be.an("array");
});

test(`GET /${path} with ADMIN role -> 200`, async ()=> {
    const response = await request(app)
        .get("/employees")
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).to.equal(200);
    expect(response.body).to.be.an("array");
});

test(`GET ${path}/id with USER role -> 200`, async ()=> {
    const response = await request(app)
        .get("/employees/id")
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${userToken}`);

    expect(response.statusCode).to.equal(200);
    expect(response.body).to.be.an("object");
});

test(`GET ${path}/id with ADMIN role -> 200`, async ()=> {
    const response = await request(app)
        .get("/employees/id")
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).to.equal(200);
    expect(response.body).to.be.an("object");
});

test(`DELETE ${path}/id with USER role -> 403`, async ()=> {
    const response = await request(app)
        .delete("/employees/id")
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${userToken}`);

    expect(response.statusCode).to.equal(403);
});

test(`DELETE ${path}/id with ADMIN role -> 200`, async ()=> {
    const response = await request(app)
        .delete("/employees/id")
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminToken}`);

    expect(response.statusCode).to.equal(200);
    expect(response.body).to.be.an("object");
});