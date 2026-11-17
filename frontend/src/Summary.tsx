import formatCurrency from "./format";

function Summary({
  income,
  expense,
  balance,
}: {
  income: number;
  expense: number;
  balance: number;
}) {
  return (
    <>
      <p>Entrada: {formatCurrency(income)}</p>
      <p>Saída: {formatCurrency(expense)}</p>
      <p>Saldo: {formatCurrency(balance)}</p>
    </>
  );
}

export default Summary;
