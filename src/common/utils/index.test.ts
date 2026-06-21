import { describe, expect, it } from "vitest";
import { cn, isActiveLink } from "@/common/utils";

describe("cn", () => {
	it("merges class names and resolves tailwind conflicts", () => {
		expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
	});

	it("ignores falsy values", () => {
		expect(cn("foo", false && "bar", undefined, "baz")).toBe("foo baz");
	});
});

describe("isActiveLink", () => {
	it("returns true when pathname matches url exactly", () => {
		expect(isActiveLink("/belajar", "/belajar")).toBe(true);
	});

	it("returns false when pathname does not match", () => {
		expect(isActiveLink("/belajar/1", "/belajar")).toBe(false);
	});

	it("returns true when pathname starts with one of the routes", () => {
		expect(isActiveLink("/admin/bab", "/admin", ["/admin"])).toBe(true);
	});
});
