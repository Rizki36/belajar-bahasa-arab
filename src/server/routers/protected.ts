import { Prisma } from "@prisma/client";
import { z } from "zod";

import prisma from "../../../prisma/db";
import { protectedProcedure, router } from "../trpc";

const defaultSelect = {
	name: true,
	value: true,
	createdAt: true,
	updatedAt: true,
} satisfies Prisma.SettingSelect;

export const protectedRouter = router({
	list: protectedProcedure.input(z.object({})).query(async () => {
		const items = await prisma.setting.findMany({
			select: defaultSelect,
		});

		return {
			items,
		};
	}),
});
