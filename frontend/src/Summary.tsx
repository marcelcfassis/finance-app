import formatCurrency from "./format";
import type { SummaryData } from "./types";

function Summary({ income, expense, balance }: SummaryData) {
  return (
    <>
      <p>Entrada: {formatCurrency(income)}</p>
      <p>Saída: {formatCurrency(expense)}</p>
      <p>Saldo: {formatCurrency(balance)}</p>
    </>
  );
}

export default Summary;
