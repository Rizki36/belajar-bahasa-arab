import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { adminProcedure, router } from "@/server/trpc";

import prisma from "../../../../prisma/db";
import { defaultSelectBab } from "./bab";

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @link https://github.com/prisma/prisma/issues/9353
 */
export const defaultSelectSubBab = {
	id: true,
	name: true,
	number: true,
	createdAt: true,
	updatedAt: true,
} satisfies Prisma.SubBabSelect;

const withEnum = z.enum(["bab"]);
const accumulator = z.enum(["countLesson"]);

export const subBabRouter = router({
	list: adminProcedure
		.input(
			z.object({
				id: z.string().uuid().optional(),
				babId: z.string().uuid().optional(),
				with: withEnum.optional().or(z.array(withEnum)).optional(),
				accumulator: accumulator.optional(),
			}),
		)
		.query(async ({ input }) => {
			const withFields = input.with
				? Array.isArray(input.with)
					? input.with
					: [input.with]
				: [];

			const includeInput: Prisma.SubBabInclude = {};
			if (withFields.includes("bab")) includeInput.bab = true;

			const whereInput: Prisma.SubBabWhereInput = {};
			if (input.id) whereInput.id = input.id;
			if (input.babId) whereInput.babId = input.babId;

			const items = await prisma.subBab.findMany({
				select: {
					...defaultSelectSubBab,
					bab: includeInput.bab
						? {
								select: defaultSelectBab,
							}
						: undefined,
					...(input.accumulator === "countLesson"
						? {
								_count: {
									select: {
										lesson: true,
									},
								},
							}
						: {}),
				},
				where: whereInput,
				orderBy: {
					number: "asc",
				},
			});

			return {
				items,
			};
		}),
	add: adminProcedure
		.input(
			z.object({
				babId: z.string().uuid(),
				name: z.string().nullable(),
				number: z.number().min(1),
			}),
		)
		.mutation(async ({ input }) => {
			const post = await prisma.subBab.create({
				data: {
					name: input.name,
					number: input.number,
					bab: {
						connect: {
							id: input.babId,
						},
					},
				},
				select: defaultSelectSubBab,
			});
			return post;
		}),
	update: adminProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().nullable(),
				number: z.number().min(1),
			}),
		)
		.mutation(async ({ input }) => {
			const { id, ...data } = input;
			const post = await prisma.subBab.update({
				where: {
					id,
				},
				data,
				select: defaultSelectSubBab,
			});
			return post;
		}),
	delete: adminProcedure
		.input(
			z.object({
				id: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const { id } = input;
			const post = await prisma.subBab.delete({
				where: {
					id,
				},
				select: defaultSelectSubBab,
			});
			return post;
		}),
});
