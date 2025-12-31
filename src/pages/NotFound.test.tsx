import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NotFound from "./NotFound";

// Mock de wouter
const mockSetLocation = vi.fn();
vi.mock("wouter", () => ({
  useLocation: () => ["/404", mockSetLocation],
}));

describe("NotFound Page", () => {
  it("debe renderizar el mensaje de error 404", () => {
    render(<NotFound />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Page Not Found")).toBeInTheDocument();
  });

  it("debe navegar al home al hacer clic en el botón 'Go Home'", () => {
    render(<NotFound />);
    const button = screen.getByRole("button", { name: /Go Home/i });
    fireEvent.click(button);
    expect(mockSetLocation).toHaveBeenCalledWith("/");
  });
});
