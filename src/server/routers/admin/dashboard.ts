import { generateConfig } from "@/common/hooks/useSystemSetting";
import { adminProcedure, router } from "@/server/trpc";

import prisma from "../../../../prisma/db";

export const dashboardRouter = router({
	babCount: adminProcedure.query(async () => {
		const count = await prisma.bab.count();

		return { count };
	}),
	studentCount: adminProcedure.query(async () => {
		const count = await prisma.student.count();

		return { count };
	}),
	scoreDistribution: adminProcedure.query(async () => {
		const configs = await prisma.setting.findMany();
		const config = generateConfig(configs);

		const rawResult = await prisma.$queryRaw<
			{ id: string; number: number; name: string; question_count: number }[]
		>`
        SELECT b.id, b.number, b.name, COUNT(l.id) AS question_count
        FROM "Bab" AS b
        LEFT JOIN "Lesson" AS l ON l."babId" = b."id"
        LEFT JOIN "Question" AS q ON q."lessonId" = l."id"
        GROUP BY b."id"
        ORDER BY b."number"
    `;

		const docs = rawResult.map((row) => ({
			...row,
			score: config.defaultScore * Number(row.question_count),
			question_count: Number(row.question_count),
		}));

		return {
			docs,
		};
	}),
	leaderBoard: adminProcedure.query(async () => {
		const rawResult = await prisma.$queryRaw<
			{
				id: string;
				name: string;
				email: string;
				score: number;
			}[]
		>`
        SELECT 
            s.id, 
            u.name, 
            u.email, 
            COALESCE(
                (
                	SELECT SUM(slr.score)  
                	FROM "StudentLessonResult" AS slr 
                	WHERE slr."studentId" = s."id"
                ),
                0
            ) AS score
        FROM "Student" AS s
        LEFT JOIN "users" AS u ON u."id" = s."userId"
        ORDER BY score DESC
        LIMIT 10
      `;

		const docs = rawResult.map((row) => ({
			...row,
			score: Number(row.score),
		}));

		return {
			docs,
		};
	}),
});
