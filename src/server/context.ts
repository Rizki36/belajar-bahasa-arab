/* eslint-disable @typescript-eslint/no-unused-vars */
import type * as trpcNext from "@trpc/server/adapters/next";
import type { Session } from "next-auth";

import prisma from "../../prisma/db";
import { getServerAuthSession } from "./auth";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateContextOptions {
	session: Session | null;
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(opts: CreateContextOptions) {
	return {
		session: opts.session,
		prisma,
	};
}

export type Context = Awaited<ReturnType<typeof createContextInner>>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export async function createContext(
	opts: trpcNext.CreateNextContextOptions,
): Promise<Context> {
	const { req, res } = opts;

	// Get the session from the server using the getServerSession wrapper function
	const session = await getServerAuthSession({ req, res });

	return createContextInner({
		session,
	});
}
