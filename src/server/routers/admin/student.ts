import { z } from "zod";

import { adminProcedure, router } from "@/server/trpc";

import prisma from "../../../../prisma/db";

type ListDataType = {
	id: string;
	name: string;
	score: number;
	progress: number;
};

type DetailDataType = {
	id: string;
	name: string;
	score: number;
	email: string;
	image: string;
};

type BabDataType = {
	id: string;
	number: number;
	name: string;
	progress: number;
	score: number;
};

type SubBabDataType = {
	id: string;
	number: number;
	name: string;
	progress: number;
	score: number;
};

export const studentRouter = router({
	list: adminProcedure
		.input(
			z.object({
				limit: z.number().optional(),
				offset: z.number().optional(),
			}),
		)
		.query(async ({ input }) => {
			const rawResult = await prisma.$queryRaw<ListDataType[]>`
        SELECT 
            s.id, 
            u.name,
            s.score,
            (
                SELECT COUNT(DISTINCT slr."lessonId") FROM "StudentLessonResult" AS slr
                WHERE slr."studentId" = s."id"
            ) AS progress
        FROM "Student" AS s
        LEFT JOIN "users" AS u  ON s."userId" = u."id"
        ORDER BY score DESC
        LIMIT ${input.limit ?? 10}
        OFFSET ${input.offset ?? 0}
    `;

			const totalLesson = await prisma.lesson.count();

			const docs = rawResult.map((item) => {
				return {
					id: item.id,
					name: item.name,
					score: Number(item.score ?? 0),
					myLesson: Number(item.progress ?? 0),
					totalLesson: Number(totalLesson ?? 0),
				};
			});

			return {
				docs,
			};
		}),
	detail: adminProcedure
		.input(z.object({ id: z.string().uuid() }))
		.query(async ({ input }) => {
			const { id } = input;
			const result = await prisma.student.findFirst({
				select: {
					id: true,
					score: true,
					user: {
						select: {
							name: true,
							email: true,
							image: true,
						},
					},
				},
				where: {
					id,
				},
			});

			if (!result) throw new Error("Student not found");

			const doc: DetailDataType = {
				id: result.id,
				email: result?.user?.email ?? "",
				image: result?.user?.image ?? "",
				name: result?.user?.name ?? "",
				score: result.score ?? 0,
			};

			return {
				doc,
			};
		}),
	listBab: adminProcedure
		.input(z.object({ studentId: z.string().uuid() }))
		.query(async ({ input }) => {
			const { studentId } = input;

			const rawResult = await prisma.$queryRaw<BabDataType[]>`
        SELECT 
            b.id,
            b.number,
            b.name,
            (
                SELECT COUNT(*) FROM "StudentLessonResult" AS slr
                JOIN "Lesson" AS l ON l."id" = slr."lessonId"
                WHERE slr."studentId" = ${studentId} AND l."babId" = b."id"
            ) AS progress,
            COALESCE((
                SELECT SUM(score) FROM "StudentLessonResult" AS slr
                JOIN "Lesson" AS l ON l."id" = slr."lessonId"
                WHERE slr."studentId" = ${studentId} AND l."babId" = b."id"
            ),0) AS score
        FROM "Bab" AS b
      `;

			const docs = rawResult.map((item) => {
				return {
					id: item.id,
					number: item.number,
					name: item.name,
					progress: Number(item.progress ?? 0),
					score: Number(item.score ?? 0),
				};
			});

			const progressMax = await prisma.lesson.groupBy({
				_count: {
					id: true,
				},
				by: "babId",
			});

			const progressMaxPerBab = progressMax.map((item) => {
				return {
					babId: item.babId,
					progressMax: item._count.id,
				};
			});

			return {
				docs,
				progressMaxPerBab,
			};
		}),
	listSubBab: adminProcedure
		.input(z.object({ studentId: z.string().uuid(), babId: z.string().uuid() }))
		.query(async ({ input }) => {
			const { studentId } = input;

			const rawResult = await prisma.$queryRaw<SubBabDataType[]>`
        SELECT 
            sb.id,
            sb.number,
            sb.name,
            (
                SELECT COUNT(*) FROM "StudentLessonResult" AS slr
                JOIN "Lesson" AS l ON l."id" = slr."lessonId"
                WHERE slr."studentId" = ${studentId} AND l."subBabId" = sb."id"
            ) AS progress,
            COALESCE((
                SELECT SUM(score) FROM "StudentLessonResult" AS slr
                JOIN "Lesson" AS l ON l."id" = slr."lessonId"
                WHERE slr."studentId" = ${studentId} AND l."subBabId" = sb."id"
            ),0) AS score
        FROM "SubBab" AS sb
        WHERE sb."babId" = ${input.babId}
        ORDER BY sb."number"
      `;

			const docs = rawResult.map((item) => {
				return {
					id: item.id,
					number: item.number,
					name: item.name,
					progress: Number(item.progress ?? 0),
					score: Number(item.score ?? 0),
				};
			});

			const progressMax = await prisma.lesson.groupBy({
				_count: {
					id: true,
				},
				by: "subBabId",
				where: {
					babId: input.babId,
				},
			});

			const progressMaxPerSubBab = progressMax.map((item) => {
				return {
					subBabId: item.subBabId,
					progressMax: item._count.id,
				};
			});

			return {
				docs,
				progressMaxPerSubBab,
			};
		}),
});
