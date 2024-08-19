import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { publicProcedure, router } from "@/server/trpc";

import prisma from "../../../../prisma/db";

/**
 * Default selector for Post.
 * It's important to always explicitly say which fields you want to return in order to not leak extra information
 * @link https://github.com/prisma/prisma/issues/9353
 */
export const defaultSelectBab = {
  id: true,
  name: true,
  number: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.BabSelect;

const accumulatorEnum = z.enum(["countSubBab"]);

export const babRouter = router({
  list: publicProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        accumulator: accumulatorEnum.optional(),
      })
    )
    .query(async ({ input }) => {
      const whereInput: Prisma.BabWhereInput = {};
      if (input.id) whereInput.id = input.id;

      const items = await prisma.bab.findMany({
        select: {
          ...defaultSelectBab,
          ...(input.accumulator === "countSubBab"
            ? {
                _count: {
                  select: {
                    subBab: true,
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
  add: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        number: z.number().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const post = await prisma.bab.create({
        data: input,
        select: defaultSelectBab,
      });
      return post;
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        number: z.number().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const post = await prisma.bab.update({
        where: {
          id,
        },
        data,
        select: defaultSelectBab,
      });
      return post;
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { id } = input;
      const post = await prisma.bab.delete({
        where: {
          id,
        },
        select: defaultSelectBab,
      });
      return post;
    }),
});