import express, { type Express, type Request, type Response } from "express";
import db from "./db";

const app: Express = express();

app.use(express.json());

app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/transactions", (req: Request, res: Response) => {
  const rows = db.prepare("SELECT * FROM transactions").all();
  res.json(rows);
});

app.post("/api/transactions", (req: Request, res: Response) => {
  const { type, amount_cents, description, date } = req.body;
  const result = db
    .prepare(
      "INSERT INTO transactions (user_id, type, amount_cents, description, date) VALUES (?, ?, ?, ?, ?)",
    )
    .run(1, type, amount_cents, description, date);
  res.status(201).json({ id: result.lastInsertRowid });
});

app.get("/api/summary", (req: Request, res: Response) => {
  const rows = db
    .prepare(
      "SELECT type, SUM(amount_cents) as total FROM transactions GROUP BY type",
    )
    .all() as { type: "income" | "expense"; total: number }[];

  const income = rows.find((row) => row.type === "income");
  const incomeTotal = income?.total ?? 0;

  const expense = rows.find((row) => row.type === "expense");
  const expenseTotal = expense?.total ?? 0;

  const balance = incomeTotal - expenseTotal;

  res.json({ income: incomeTotal, expense: expenseTotal, balance });
});

export default app;
