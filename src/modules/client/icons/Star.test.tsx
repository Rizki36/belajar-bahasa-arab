import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import StarIcon from "./Star";

describe("StarIcon", () => {
	it("renders as an accessible svg", () => {
		render(<StarIcon data-testid="star-icon" filled />);
		expect(screen.getByTestId("star-icon")).toBeInTheDocument();
	});

	it("applies bounce animation when enabled", () => {
		const { container } = render(<StarIcon enableBounce />);
		expect(container.firstChild).toHaveClass("animate-bounce");
	});
});
