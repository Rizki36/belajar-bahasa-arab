import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { adminProcedure, router } from "@/server/trpc";

import prisma from "../../../../prisma/db";
import { defaultSelectBab } from "./bab";
import { defaultSelectSubBab } from "./subBab";

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @link https://github.com/prisma/prisma/issues/9353
 */
export const defaultSelectLesson = {
	id: true,
	number: true,
	createdAt: true,
	updatedAt: true,
} satisfies Prisma.LessonSelect;

const withEnum = z.enum(["bab", "subBab"]);
const accumulator = z.enum(["countQuestion"]);

export const lessonRouter = router({
	list: adminProcedure
		.input(
			z.object({
				id: z.string().uuid().optional(),
				babId: z.string().uuid().optional(),
				subBabId: z.string().uuid().optional(),
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

			const includeInput: Prisma.LessonInclude = {};
			if (withFields.includes("bab")) includeInput.bab = true;
			if (withFields.includes("subBab")) includeInput.subBab = true;

			const whereInput: Prisma.LessonWhereInput = {};
			if (input.id) whereInput.id = input.id;
			if (input.babId) whereInput.babId = input.babId;
			if (input.subBabId) whereInput.subBabId = input.subBabId;

			const items = await prisma.lesson.findMany({
				select: {
					...defaultSelectLesson,
					bab: includeInput.bab
						? {
								select: defaultSelectBab,
							}
						: undefined,
					subBab: includeInput.subBab
						? {
								select: defaultSelectSubBab,
							}
						: undefined,
					...(input.accumulator === "countQuestion"
						? {
								_count: {
									select: {
										question: true,
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
				subBabId: z.string().uuid(),
				number: z.number().min(1),
			}),
		)
		.mutation(async ({ input }) => {
			const post = await prisma.lesson.create({
				data: {
					number: input.number,
					bab: {
						connect: {
							id: input.babId,
						},
					},
					subBab: {
						connect: {
							id: input.subBabId,
						},
					},
				},
				select: defaultSelectLesson,
			});
			return post;
		}),
	update: adminProcedure
		.input(
			z.object({
				id: z.string(),
				number: z.number().min(1),
			}),
		)
		.mutation(async ({ input }) => {
			const { id, ...data } = input;
			const post = await prisma.lesson.update({
				where: {
					id,
				},
				data,
				select: defaultSelectLesson,
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
			const post = await prisma.lesson.delete({
				where: {
					id,
				},
				select: defaultSelectLesson,
			});
			return post;
		}),
});
