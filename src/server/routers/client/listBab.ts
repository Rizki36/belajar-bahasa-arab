import { z } from "zod";

import prisma from "../../../../prisma/db";
import { router, studentProcedure } from "../../trpc";

export const listBabRoute = router({
	listBab: studentProcedure
		.input(
			z.object({
				studentId: z.string(),
			}),
		)
		.query(async ({ input }) => {
			const bab = await prisma.bab.findMany();

			type Result = (typeof bab)[number] & {
				myLesson: number;
				totalLesson: number;
			};

			const docs: Result[] = [];

			for (const babItem of bab) {
				const totalLesson = await prisma.lesson.count({
					where: {
						subBab: {
							babId: babItem.id,
						},
					},
				});
				const myLesson = await prisma.studentLessonResult.count({
					where: {
						studentId: input.studentId,
						lesson: {
							subBab: {
								babId: babItem.id,
							},
						},
					},
				});

				docs.push({ ...babItem, myLesson, totalLesson });
			}

			return {
				docs,
			};
		}),
});
