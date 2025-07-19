import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { adminProcedure, router } from "@/server/trpc";

import prisma from "../../../../prisma/db";

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @link https://github.com/prisma/prisma/issues/9353
 */
const defaultSelect = {
	name: true,
	value: true,
	createdAt: true,
	updatedAt: true,
} satisfies Prisma.SettingSelect;

export const settingRouter = router({
	upsert: adminProcedure
		.input(
			z.object({
				items: z.array(
					z.object({
						id: z.string().uuid().optional(),
						name: z.string().min(1),
						value: z.string().min(1),
					}),
				),
			}),
		)
		.mutation(async ({ input }) => {
			prisma.$transaction(async (trx) => {
				const requests: unknown[] = [];

				input.items.forEach((item) => {
					const req = trx.setting.upsert({
						where: {
							name: item.name,
						},
						update: {
							name: item.name,
							value: item.value,
						},
						create: {
							name: item.name,
							value: item.value,
						},
						select: defaultSelect,
					});

					requests.push(req);
				});

				await Promise.all(requests);
			});

			return {};
		}),
});
