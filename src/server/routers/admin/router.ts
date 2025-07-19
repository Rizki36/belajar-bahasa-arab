import { router } from "@/server/trpc";

import { babRouter } from "./bab";
import { dashboardRouter } from "./dashboard";
import { lessonRouter } from "./lesson";
import { questionRouter } from "./question";
import { selfRoute } from "./self";
import { settingRouter } from "./setting";
import { studentRouter } from "./student";
import { subBabRouter } from "./subBab";

export const adminRouter = router({
	dashboard: dashboardRouter,
	bab: babRouter,
	setting: settingRouter,
	student: studentRouter,
	subBab: subBabRouter,
	question: questionRouter,
	lesson: lessonRouter,
	self: selfRoute,
});
