import { z } from "zod";

import { protectedProcedure, router } from "@/server/trpc";

/**
 *  This route get the data based on the user session
 */
export const selfRoute = router({
	createAdmin: protectedProcedure
		.input(
			z.object({
				secret: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			// check secret
			if (input.secret !== process.env.CREATE_ADMIN_SECRET) {
				throw new Error("Invalid secret");
			}

			// update role to admin
			await ctx.prisma.user.update({
				where: {
					id: ctx?.session?.user?.id,
				},
				data: {
					role: "admin",
				},
			});
		}),
});
