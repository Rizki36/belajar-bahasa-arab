/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @link https://trpc.io/docs/v11/router
 * @link https://trpc.io/docs/v11/procedures
 */

import { initTRPC, TRPCError } from "@trpc/server";

import { transformer } from "@/utils/transformer";

import { Context } from "./context";

const t = initTRPC.context<Context>().create({
	/**
	 * @link https://trpc.io/docs/v11/data-transformers
	 */
	transformer,
	/**
	 * @link https://trpc.io/docs/v11/error-formatting
	 */
	errorFormatter({ shape }) {
		return shape;
	},
});

/**
 * Create a router
 * @link https://trpc.io/docs/v11/router
 */
export const router = t.router;

/**
 * Create an unprotected procedure
 * @link https://trpc.io/docs/v11/procedures
 **/
export const publicProcedure = t.procedure;

/**
 * Reusable middleware that enforces users are logged in before running the
 * procedure
 */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
	if (!ctx.session || !ctx.session.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({
		ctx: {
			// infers the `session` as non-nullable
			session: { ...ctx.session, user: ctx.session.user },
		},
	});
});
export const protectedProcedure = publicProcedure.use(enforceUserIsAuthed);

const adminOnly = t.middleware(({ ctx, next }) => {
	if (ctx.session?.user?.role !== "admin") {
		throw new TRPCError({ code: "FORBIDDEN" });
	}
	return next();
});
export const adminProcedure = protectedProcedure.use(adminOnly);

const studentOnly = t.middleware(({ ctx, next }) => {
	if (ctx.session?.user?.role !== "student") {
		throw new TRPCError({ code: "FORBIDDEN" });
	}
	return next();
});
export const studentProcedure = protectedProcedure.use(studentOnly);

/**
 * Merge multiple routers together
 * @link https://trpc.io/docs/v11/merging-routers
 */
export const mergeRouters = t.mergeRouters;

/**
 * Create a server-side caller
 * @link https://trpc.io/docs/v11/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;
