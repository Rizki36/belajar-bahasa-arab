// https://github.com/hiteshchoudhary/nextjs-fullstack-auth/tree/main
import { type NextRequest, NextResponse } from "next/server";
import type { JWT } from "next-auth/jwt";
// import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

// start with /admin
const isAdminPath = (path: string) => path.startsWith("/admin");

// ['/login', '/register', '/forgot-password']
const isPublicPath = (path: string) => {
	const publicPaths = [
		"/",
		"/login",
		"/login/admin",
		"/register",
		"/forgot-password",
		"/privacy-policy",
	];
	return publicPaths.includes(path);
};

const middleware = (request: NextRequest) => {
	// @ts-ignore
	const token = request?.nextauth?.token as JWT | undefined;
	const path = request.nextUrl.pathname;

	// student can't access admin
	if (isAdminPath(path) && token && token.role === "student") {
		return NextResponse.redirect(new URL("/belajar", request.nextUrl));
	}

	// admin can't access student
	if (!isAdminPath(path) && token && token.role === "admin") {
		return NextResponse.redirect(new URL("/admin", request.nextUrl));
	}

	// after login can't access public path
	if (isPublicPath(path) && token) {
		if (token.role === "student")
			return NextResponse.redirect(new URL("/belajar", request.nextUrl));

		if (token.role === "admin")
			return NextResponse.redirect(new URL("/admin", request.nextUrl));
	}
};

export default withAuth(middleware, {
	callbacks: {
		authorized: ({ req, token }) => {
			const { pathname } = req.nextUrl;

			if (isPublicPath(pathname)) return true;

			return !!token;
		},
	},
});

export const config = {
	matcher: [
		"/create-student",
		"/belajar/:path*",
		"/admin/:path*",

		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};
