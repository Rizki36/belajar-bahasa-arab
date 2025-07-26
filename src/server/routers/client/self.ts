import type { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { z } from "zod";

import prisma from "../../../../prisma/db";
import { router, studentProcedure } from "../../trpc";

/**
 *  This route get the data based on the user session
 */
export const selfRoute = router({
	updateSetting: studentProcedure
		.input(
			z.object({
				name: z.string(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			const student = await prisma.user.update({
				where: {
					id: ctx?.session?.user?.id,
				},
				data: {
					name: input.name,
				},
			});

			return {
				student,
			};
		}),
	student: studentProcedure.query(async ({ ctx }) => {
		const student = await prisma.student.findFirst({
			where: {
				userId: ctx?.session?.user?.id,
			},
			include: {
				latestBab: {
					select: {
						id: true,
						number: true,
					},
				},
			},
		});

		return {
			student,
		};
	}),
	updateScore: studentProcedure
		.input(
			z.object({
				studentId: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const lessonResults = await prisma.studentLessonResult.groupBy({
				by: ["studentId"],
				_sum: {
					score: true,
				},
				where: {
					studentId: input.studentId,
				},
			});

			const score = lessonResults?.[0]?._sum?.score ?? 0;
			if (!score) return;

			const student = await prisma.student.update({
				where: {
					id: input.studentId,
				},
				data: {
					score,
				},
			});

			return {
				student,
			};
		}),
	progress: studentProcedure
		.input(
			z.object({
				studentId: z.string(),
				babId: z.string(),
			}),
		)
		.query(async ({ input }) => {
			const totalLesson = await prisma.lesson.count({
				where: {
					subBab: {
						babId: input.babId,
					},
				},
			});
			const myLesson = await prisma.studentLessonResult.count({
				where: {
					studentId: input.studentId,
					lesson: {
						subBab: {
							babId: input.babId,
						},
					},
				},
			});

			return {
				myLesson,
				totalLesson,
			};
		}),
	createStudent: studentProcedure.mutation(async ({ ctx }) => {
		const student = await ctx.prisma.student
			.create({
				data: {
					userId: ctx.session.user.id,
				},
			})
			.catch((e) => {
				const error = e as PrismaClientKnownRequestError;

				// student already exists
				if (error.code === "P2002") {
					return null;
				}

				throw e;
			});

		return {
			student,
		};
	}),
});
