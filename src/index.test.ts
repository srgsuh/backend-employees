import supertest from "supertest";
import app from "./index.ts";
import test from "node:test";
import assert from "node:assert/strict";


test("GET /employee w/o token -> 401", async ()=> {
    const response = await supertest(app).get("/employees");

    assert.equal(response.statusCode, 401);
});