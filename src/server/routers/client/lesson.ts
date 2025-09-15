import { z } from "zod";

import { generateConfig } from "@/common/hooks/useSystemSetting";

import prisma from "../../../../prisma/db";
import { router, studentProcedure } from "../../trpc";

export const lessonRoute = router({
	data: studentProcedure
		.input(
			z.object({
				studentId: z.string(),
				babNumber: z.number(),
				subBabNumber: z.number(),
				lessonNumber: z.number(),
			}),
		)
		.query(async ({ input }) => {
			const studentId = input.studentId;

			const bab = await prisma.bab.findFirst({
				select: {
					id: true,
					number: true,
					name: true,
				},
				where: {
					number: input.babNumber,
				},
			});
			if (!bab) throw new Error("Bab not found");

			const subBab = await prisma.subBab.findFirst({
				select: {
					id: true,
					number: true,
					name: true,
				},
				where: {
					babId: bab.id,
					number: input.subBabNumber,
				},
			});

			if (!subBab) throw new Error("SubBab not found");

			const lesson = await prisma.lesson.findFirst({
				select: {
					id: true,
					number: true,
					title: true,
					description: true,
					contentType: true,
					videoUrl: true,
					pdfUrl: true,
				},
				where: {
					subBabId: subBab.id,
					number: input.lessonNumber,
				},
			});

			if (!lesson) throw new Error("Lesson not found");

			// Access validation logic
			let canAccess = false;

			// Case 1: First lesson of first subBab of any bab
			if (input.subBabNumber === 1 && input.lessonNumber === 0) {
				if (input.babNumber === 1) {
					// First bab is always accessible
					canAccess = true;
				} else {
					// Check if last lesson of last subBab of previous bab is completed
					const previousBab = await prisma.bab.findFirst({
						where: {
							number: input.babNumber - 1,
						},
					});

					if (previousBab) {
						// Find last subBab of previous bab
						const lastSubBabOfPreviousBab = await prisma.subBab.findFirst({
							where: {
								babId: previousBab.id,
							},
							orderBy: {
								number: "desc",
							},
						});

						if (lastSubBabOfPreviousBab) {
							// Find last lesson of that subBab
							const lastLessonOfPreviousBab = await prisma.lesson.findFirst({
								where: {
									subBabId: lastSubBabOfPreviousBab.id,
								},
								orderBy: {
									number: "desc",
								},
								include: {
									studentLessonResult: {
										where: {
											studentId,
										},
									},
								},
							});

							canAccess =
								(lastLessonOfPreviousBab?.studentLessonResult?.length ?? 0) > 0;
						}
					}
				}
			}
			// Case 2: First lesson of a subBab (not the first subBab within same bab)
			else if (input.lessonNumber === 0 && input.subBabNumber > 1) {
				// Check if last lesson of previous subBab is completed
				const previousSubBab = await prisma.subBab.findFirst({
					where: {
						babId: bab.id,
						number: input.subBabNumber - 1,
					},
				});

				if (previousSubBab) {
					const lastLessonOfPreviousSubBab = await prisma.lesson.findFirst({
						where: {
							subBabId: previousSubBab.id,
						},
						orderBy: {
							number: "desc",
						},
						include: {
							studentLessonResult: {
								where: {
									studentId,
								},
							},
						},
					});

					canAccess =
						(lastLessonOfPreviousSubBab?.studentLessonResult?.length ?? 0) > 0;
				}
			}
			// Case 3: Not first lesson of subBab (lessonNumber > 0)
			else if (input.lessonNumber > 0) {
				// Check if previous lesson in same subBab is completed
				const previousLesson = await prisma.lesson.findFirst({
					where: {
						subBabId: subBab.id,
						number: input.lessonNumber - 1,
					},
					include: {
						studentLessonResult: {
							where: {
								studentId,
							},
						},
					},
				});

				canAccess = (previousLesson?.studentLessonResult?.length ?? 0) > 0;
			}


			return {
				bab,
				subBab,
				lesson,
				canAccess,
			};
		}),
	checkAnswer: studentProcedure
		.input(
			z.object({
				questionId: z.string(),
				answerId: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const answer = await prisma.answer.findFirst({
				where: {
					id: input.answerId,
					questionId: input.questionId,
				},
			});

			if (!answer) throw new Error("Answer not found");

			return {
				isCorrect: answer.isCorrect,
			};
		}),
	submitQuiz: studentProcedure
		.input(
			z.object({
				studentId: z.string(),
				lessonId: z.string(),
				heartCount: z.number(),
				answers: z.array(
					z.object({
						questionId: z.string(),
						answerId: z.string(),
					}),
				),
			}),
		)
		.mutation(async ({ input }) => {
			const questions = await prisma.question.findMany({
				where: {
					lessonId: input.lessonId,
				},
			});

			const correctAnswers = await prisma.answer.findMany({
				where: {
					questionId: {
						in: questions.map((question) => question.id),
					},
					isCorrect: true,
				},
			});

			const correctAnswerIds = correctAnswers.map((answer) => answer.id);

			const totalCorrect = input.answers.filter((answer) =>
				correctAnswerIds.includes(answer.answerId),
			).length;

			const configs = await prisma.setting.findMany();
			const config = generateConfig(configs);

			const score = totalCorrect * config.defaultScore;
			const star = input.heartCount; // TODO: calculate star

			if (star < 1) {
				return {
					totalQuestion: questions.length,
					totalCorrect,
					star: 0,
					score: 0,
				};
			}

			const lessonResult = await prisma.studentLessonResult.findFirst({
				where: {
					studentId: input.studentId,
					lessonId: input.lessonId,
				},
			});

			await prisma.studentLessonResult.upsert({
				create: {
					lessonId: input.lessonId,
					studentId: input.studentId,
					score,
					star,
				},
				update: {
					score,
					star,
				},
				where: {
					id: lessonResult?.id ?? "",
					studentId: input.studentId,
					lessonId: input.lessonId,
				},
			});

			return {
				totalQuestion: questions.length,
				totalCorrect,
				star,
				score,
			};
		}),
	submitVideoOrPdf: studentProcedure
		.input(
			z.object({
				studentId: z.string(),
				lessonId: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			// Find the lesson to verify it exists
			const lesson = await prisma.lesson.findUnique({
				where: {
					id: input.lessonId,
				},
			});

			if (!lesson) throw new Error("Lesson not found");

			const lessonResult = await prisma.studentLessonResult.findFirst({
				where: {
					studentId: input.studentId,
					lessonId: input.lessonId,
				},
			});

			// Set score and star to 0 for video lessons
			const score = 0;
			const star = 0;

			// Record that the student has completed this video lesson
			await prisma.studentLessonResult.upsert({
				create: {
					lessonId: input.lessonId,
					studentId: input.studentId,
					score,
					star,
				},
				update: {
					// If already exists, we don't need to update anything
				},
				where: {
					id: lessonResult?.id ?? "",
					studentId: input.studentId,
					lessonId: input.lessonId,
				},
			});

			return {};
		}),
	listQuestion: studentProcedure
		.input(
			z.object({
				lessonId: z.string(),
			}),
		)
		.query(async ({ input }) => {
			const lesson = await prisma.lesson.findFirst({
				where: {
					id: input.lessonId,
				},
			});

			if (!lesson) throw new Error("Lesson not found");

			const questions = await prisma.question.findMany({
				select: {
					id: true,
					question: true,
					number: true,
					answer: {
						select: {
							id: true,
							answer: true,
							number: true,
						},
					},
				},
				where: {
					lessonId: lesson.id,
				},
			});

			return {
				questions,
			};
		}),
});
