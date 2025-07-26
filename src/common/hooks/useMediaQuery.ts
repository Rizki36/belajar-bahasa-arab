import { useState } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Custom hook that tells you whether a given media query is active.
 * Useful for responsive designs.
 *
 * @param query - A valid CSS media query
 * @returns boolean indicating if the media query matches
 */
export function useMediaQuery(query: string): boolean {
	const [matches, setMatches] = useState<boolean>(false);

	// Using isomorphic layout effect to avoid warnings during SSR
	useIsomorphicLayoutEffect(() => {
		// Handle SSR - return default value on the server
		if (typeof window === "undefined") {
			return;
		}

		const mediaQuery = window.matchMedia(query);

		// Set initial value
		setMatches(mediaQuery.matches);

		// Create listener function
		const listener = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		// Add listener for changes
		mediaQuery.addEventListener("change", listener);

		// Clean up
		return () => {
			mediaQuery.removeEventListener("change", listener);
		};
	}, [query]);

	return matches;
}
