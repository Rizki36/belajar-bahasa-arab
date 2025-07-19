import { router } from "@/server/trpc";

import { leaderboardRoute } from "./leaderboard";
import { learnRoute } from "./learn";
import { lessonRoute } from "./lesson";
import { listBabRoute } from "./listBab";
import { selfRoute } from "./self";

export const studentRouter = router({
	self: selfRoute,
	learn: learnRoute,
	listBab: listBabRoute,
	lesson: lessonRoute,
	leaderboard: leaderboardRoute,
});
