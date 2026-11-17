export type SummaryData = {
  income: number;
  expense: number;
  balance: number;
};

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: number;
  type: TransactionType;
  amount_cents: number;
  description: string;
  date: string;
};
