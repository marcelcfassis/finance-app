import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "./app";

describe("GET /api/health", () => {
  it("respond 200 and status ok", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});

describe("GET /api/transactions", () => {
  it("it should list transactions", async () => {
    const res = await request(app).get("/api/transactions");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe("GET /api/summary", () => {
  it("it should show zero balance when there is no tx", async () => {
    const res = await request(app).get("/api/summary");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ income: 0, expense: 0, balance: 0 });
  });

  it("it should show finance balance", async () => {
    const before = await request(app).get("/api/summary");
    await request(app).post("/api/transactions").send({
      type: "income",
      amount_cents: 30000,
      description: "Salario",
      date: "2026-11-16",
    });

    await request(app).post("/api/transactions").send({
      type: "expense",
      amount_cents: 3000,
      description: "Mercado",
      date: "2026-11-16",
    });
    const after = await request(app).get("/api/summary");

    expect(after.body.income - before.body.income).toBe(30000);
    expect(after.body.expense - before.body.expense).toBe(3000);
    expect(after.body.balance).toBe(27000);
  });
});

describe("POST /api/transactions", () => {
  it("it create a item in transactions", async () => {
    const res = await request(app).post("/api/transactions").send({
      type: "expense",
      amount_cents: 3000,
      description: "Mercado",
      date: "2026-11-15",
    });
    expect(res.status).toBe(201);
    expect(typeof res.body.id).toBe("number");
  });
});
