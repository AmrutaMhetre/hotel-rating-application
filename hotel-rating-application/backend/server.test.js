const request = require("supertest");
const express = require("express");
const app = require("./server"); // make sure this exports your app

describe("Hotel API Tests", () => {
  let newHotelId;

  test("GET /hotels should return all hotels", async () => {
    const res = await request(app).get("/hotels");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test("POST /hotels should add a new hotel", async () => {
    const res = await request(app)
      .post("/hotels")
      .send({
        name: "Test Hotel",
        location: "Test City",
        rating: 4.5,
        category: "3 Star",
        peakPeriod: "Jan - Feb"
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Test Hotel");
    newHotelId = res.body.id; // save for later tests
  });

  test("PUT /hotels/:id should update the hotel", async () => {
    const res = await request(app)
      .put(`/hotels/${newHotelId}`)
      .send({ name: "Updated Hotel", location: "Test City", rating: 4.6, category: "3 Star", peakPeriod: "Jan - Feb" });
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Hotel");
  });

  test("GET /hotels/highest-rating should return highest rated hotel", async () => {
    const res = await request(app).get("/hotels/highest-rating");
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("rating");
  });

  test("DELETE /hotels/:id should delete the hotel", async () => {
    const res = await request(app).delete(`/hotels/${newHotelId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Deleted");
  });
});


