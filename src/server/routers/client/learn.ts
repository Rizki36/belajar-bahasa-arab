import type { Prisma } from "@prisma/client";
import { z } from "zod";

import prisma from "../../../../prisma/db";
import { router, studentProcedure } from "../../trpc";

export const learnRoute = router({
	isBabExist: studentProcedure
		.input(z.object({ babNumber: z.number() }))
		.query(async ({ input }) => {
			const bab = await prisma.bab.findFirst({
				where: {
					number: input.babNumber,
				},
			});

			return {
				isExist: !!bab,
			};
		}),
	bab: studentProcedure
		.input(
			z.object({
				babNumber: z.number(),
			}),
		)
		.query(async ({ input }) => {
			const bab = await prisma.bab.findFirst({
				where: {
					number: input.babNumber,
				},
			});

			return {
				bab,
			};
		}),
	subBabList: studentProcedure
		.input(
			z.object({
				babId: z.string(),
				studentId: z.string(),
			}),
		)
		.query(async ({ input }) => {
			const subBabList = await prisma.subBab.findMany({
				where: {
					babId: input.babId,
				},
				include: {
					lesson: {
						include: {
							studentLessonResult: {
								where: {
									studentId: input.studentId,
								},
								take: 1,
							},
						},
						orderBy: {
							number: "asc",
						},
					},
				},
				orderBy: {
					number: "asc",
				},
			});

			return {
				subBabList,
			};
		}),

	updateLatestBab: studentProcedure
		.input(z.object({ babNumber: z.number() }))
		.mutation(async ({ input, ctx }) => {
			const bab = await prisma.bab.findFirst({
				where: {
					number: input.babNumber,
				},
			});

			await prisma.student.update({
				where: {
					userId: ctx?.session?.user?.id,
				},
				data: {
					latestBabId: bab?.id,
				},
			});

			return {
				success: true,
			};
		}),
	checkLatestBab: studentProcedure.mutation(async ({ ctx }) => {
		const student = await prisma.student.findFirst({
			select: {
				id: true,
				latestBabId: true,
			},
			where: {
				userId: ctx?.session?.user?.id,
			},
		});

		const whereLatestBab: Prisma.BabWhereInput = student?.latestBabId
			? { id: student?.latestBabId }
			: {
					number: 1,
				};

		const latestBab = await prisma.bab.findFirst({
			select: {
				id: true,
				number: true,
			},
			where: whereLatestBab,
		});

		if (!latestBab) {
			return {
				latestBab: null,
			};
		}

		const studentLessonResultCount = await prisma.studentLessonResult.count({
			where: {
				studentId: student?.id,
				lesson: {
					babId: latestBab.id,
				},
			},
		});

		const babLessonCount = await prisma.lesson.count({
			where: {
				babId: latestBab.id,
			},
		});

		const isComplete = studentLessonResultCount >= babLessonCount;

		if (!isComplete) {
			return {
				latestBab: undefined,
			};
		}

		const latestBabNumber = latestBab.number + 1;

		const newLatestBab = await prisma.bab.findFirst({
			where: {
				number: latestBabNumber,
			},
		});

		if (!newLatestBab) {
			return {
				latestBab: undefined,
			};
		}

		await prisma.student.update({
			where: {
				id: student?.id,
			},
			data: {
				latestBabId: newLatestBab.id,
			},
		});

		return {
			latestBab,
		};
	}),
});
