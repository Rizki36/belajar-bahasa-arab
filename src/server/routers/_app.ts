/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, router } from "../trpc";
import { adminRouter } from "./admin/router";
import { studentRouter } from "./client/router";
import { protectedRouter } from "./protected";

export const appRouter = router({
	admin: adminRouter,
	student: studentRouter,
	protected: protectedRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
