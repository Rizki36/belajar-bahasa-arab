import { z } from "zod";
import { router, studentProcedure } from "@/server/trpc";

import prisma from "../../../../prisma/db";

export const leaderboardRoute = router({
	list: studentProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).default(10),
				cursor: z.string().nullish(), // For pagination
			}),
		)
		.query(async ({ input }) => {
			const { limit, cursor } = input;

			// First, get student IDs with their total scores ordered by score
			const lessonResults = await prisma.studentLessonResult.groupBy({
				by: ["studentId"],
				_sum: {
					score: true,
				},
				orderBy: {
					_sum: {
						score: "desc",
					},
				},
			});

			// Map to a format that's easier to work with for cursor pagination
			const rankedStudents = lessonResults.map((item, index) => ({
				studentId: item.studentId,
				score: item._sum.score ?? 0,
				rank: index + 1, // Add rank for cursor reference
			}));

			// Find the cursor position if provided
			let startIndex = 0;
			if (cursor) {
				const cursorIndex = rankedStudents.findIndex(
					(s) => s.studentId === cursor,
				);
				if (cursorIndex !== -1) {
					startIndex = cursorIndex + 1; // Start after the cursor
				}
			}

			// Get the paginated slice with one extra to determine if there's more
			const paginatedStudentIds = rankedStudents
				.slice(startIndex, startIndex + limit + 1)
				.map((item) => item.studentId);

			// Determine if there's a next page
			const hasMore = paginatedStudentIds.length > limit;
			if (hasMore) {
				paginatedStudentIds.pop(); // Remove the extra item
			}

			// Get the detailed student data for the current page
			const students = await prisma.student.findMany({
				select: {
					id: true,
					user: {
						select: {
							name: true,
							image: true,
						},
					},
				},
				where: {
					id: {
						in: paginatedStudentIds,
					},
				},
			});

			// Create a map for easy lookup
			const studentMap = students.reduce(
				(acc, item) => {
					acc[item.id] = item;
					return acc;
				},
				{} as Record<string, (typeof students)[number]>,
			);

			// Create the final leaderboard with rank information
			const leaderboard = paginatedStudentIds.map((studentId, index) => {
				const student = studentMap[studentId];
				const studentRank = rankedStudents.find(
					(r) => r.studentId === studentId,
				)!;

				return {
					id: studentId,
					name: student?.user?.name,
					image: student?.user?.image,
					score: studentRank.score,
					rank: startIndex + index + 1, // Calculate actual rank
				};
			});

			// Set the next cursor to the ID of the last item if there are more
			const nextCursor = hasMore
				? paginatedStudentIds[paginatedStudentIds.length - 1]
				: undefined;

			return {
				leaderboard,
				nextCursor,
			};
		}),
});
