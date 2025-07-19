/* eslint-disable no-restricted-imports */
import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge classes with tailwind-merge with clsx full feature */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const isActiveLink = (
	pathname: string,
	url: string,
	routes?: string[],
) => {
	// Check if the current pathname is equal to the url
	if (pathname === url) {
		return true;
	}

	// Check if the current pathname is starts with routes
	if (routes) {
		return routes.some((route) => pathname.startsWith(route));
	}

	return false;
};

export const generateStudentBabLink = (babNumber: number) => {
	return `${process.env.NEXT_PUBLIC_APP_URL}/belajar/${babNumber}`;
};
