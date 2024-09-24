import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { adminProcedure, router } from "@/server/trpc";

import prisma from "../../../../prisma/db";
import { defaultSelectLesson } from "./lesson";

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @link https://github.com/prisma/prisma/issues/9353
 */
const defaultSelect = {
  id: true,
  number: true,
  question: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.QuestionSelect;

const withEnum = z.enum(["lesson", "answers"]);

export const questionRouter = router({
  list: adminProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        with: withEnum.optional().or(z.array(withEnum)).optional(),
        lessonId: z.string().uuid().optional(),
      })
    )
    .query(async ({ input }) => {
      const withFields = input.with
        ? Array.isArray(input.with)
          ? input.with
          : [input.with]
        : [];

      const includeInput: Prisma.QuestionInclude = {};
      if (withFields.includes("lesson")) includeInput.lesson = true;
      if (withFields.includes("answers")) includeInput.answer = true;

      const whereInput: Prisma.QuestionWhereInput = {};
      if (input.id) whereInput.id = input.id;
      if (input.lessonId) whereInput.lessonId = input.lessonId;

      const items = await prisma.question.findMany({
        select: {
          ...defaultSelect,
          lesson: includeInput.lesson
            ? {
                select: defaultSelectLesson,
              }
            : undefined,
          answer: includeInput.answer
            ? {
                select: {
                  id: true,
                  isCorrect: true,
                  answer: true,
                  number: true,
                },
                orderBy: {
                  number: "asc",
                },
              }
            : undefined,
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

  addBulkQuestion: adminProcedure
    .input(
      z.object({
        lessonId: z.string().uuid(),
        questions: z.array(
          z.object({
            id: z.string().uuid().optional(),
            number: z.number().min(1),
            question: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const questions = await prisma.question.createMany({
        data: input.questions.map((question) => ({
          id: question.id,
          number: question.number,
          question: question.question,
          lessonId: input.lessonId,
        })),
      });

      return questions;
    }),
  addBulkAnswer: adminProcedure
    .input(
      z.object({
        answers: z.array(
          z.object({
            id: z.string().uuid().optional(),
            number: z.number().min(1),
            text: z.string(),
            isCorrect: z.boolean(),
            questionId: z.string().uuid(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      const answers = await prisma.answer.createMany({
        data: input.answers.map((answer) => ({
          id: answer.id,
          number: answer.number,
          answer: answer.text,
          isCorrect: answer.isCorrect,
          questionId: answer.questionId,
        })),
      });

      return answers;
    }),
  deleteBulkQuestion: adminProcedure
    .input(
      z.object({
        questions: z.array(z.object({ id: z.string().uuid() })),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.question.deleteMany({
        where: {
          id: {
            in: input.questions.map((question) => question.id),
          },
        },
      });
    }),
  deleteBulkAnswer: adminProcedure
    .input(
      z.object({
        answers: z.array(z.object({ id: z.string().uuid() })),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.answer.deleteMany({
        where: {
          id: {
            in: input.answers.map((answer) => answer.id),
          },
        },
      });
    }),
  updateBulkQuestion: adminProcedure
    .input(
      z.object({
        lessonId: z.string().uuid(),
        questions: z.array(
          z.object({
            id: z.string().uuid().optional(),
            number: z.number().min(1),
            question: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      for (const question of input.questions) {
        await prisma.question.update({
          where: {
            id: question.id,
          },
          data: {
            number: question.number,
            question: question.question,
          },
        });
      }
    }),
  updateBulkAnswer: adminProcedure
    .input(
      z.object({
        answers: z.array(
          z.object({
            id: z.string().uuid().optional(),
            number: z.number().min(1),
            text: z.string(),
            isCorrect: z.boolean(),
            questionId: z.string().uuid(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      for (const answer of input.answers) {
        await prisma.answer.update({
          where: {
            id: answer.id,
          },
          data: {
            number: answer.number,
            answer: answer.text,
            isCorrect: answer.isCorrect,
            questionId: answer.questionId,
          },
        });
      }
    }),
});
