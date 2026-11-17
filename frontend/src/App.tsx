import { useState, useEffect } from "react";
import Summary from "./Summary";
import formatCurrency from "./format";

type Transaction = {
  id: number;
  type: "income" | "expense";
  amount_cents: number;
  description: string;
  date: string;
};

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [description, setDescription] = useState("");
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

  useEffect(() => {
    loadTransactions();
    loadSummary();
  }, []);

  function loadTransactions() {
    fetch("/api/transactions")
      .then((res) => res.json())
      .then((data) => setTransactions(data));
  }

  function loadSummary() {
    fetch("/api/summary")
      .then((res) => res.json())
      .then((data) => setSummary(data));
  }

  function handleSubmit() {
    const amount_cents = Math.round(Number(amount) * 100);
    fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, amount_cents, description, date }),
    }).then(() => {
      loadTransactions();
      loadSummary();
      setDescription("");
      setAmount("");
      setDate("");
    });
  }

  return (
    <div>
      <h1>Finance App</h1>
      <input
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descrição"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Valor"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="expense">Saída</option>
        <option value="income">Entrada</option>
      </select>
      <button onClick={handleSubmit}>Salvar</button>
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.description} | {t.type === "expense" ? "-" : "+"}{" "}
            {formatCurrency(t.amount_cents)} | {t.date}
          </li>
        ))}
      </ul>
      <Summary
        income={summary.income}
        expense={summary.expense}
        balance={summary.balance}
      />
    </div>
  );
}

export default App;
