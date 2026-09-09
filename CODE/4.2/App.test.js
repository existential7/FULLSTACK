import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("renders calendar header", () => {
  render(<App />);
  expect(screen.getByText(/Post Scheduling Calendar/i)).toBeInTheDocument();
});

test("can type into schedule input", () => {
  render(<App />);
  const input = screen.getByPlaceholderText(/Write your post here/i);
  fireEvent.change(input, { target: { value: "Test post" } });
  expect(input.value).toBe("Test post");
});
