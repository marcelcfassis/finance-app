import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import App from "./App";

describe("App", () => {
  it("shows the balance from the summary", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url: string) =>
        Promise.resolve({
          json: () =>
            Promise.resolve(
              url === "/api/summary"
                ? { income: 1000, expense: 400, balance: 600 }
                : [],
            ),
        }),
      ),
    );

    render(<App />);

    expect(await screen.findByText(/6,00/)).toBeInTheDocument();
  });
});
