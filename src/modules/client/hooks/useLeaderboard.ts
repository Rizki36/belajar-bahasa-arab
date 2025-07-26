import { type RouterOutput, trpc } from "@/utils/trpc";

export type LeaderboardItem =
	RouterOutput["student"]["leaderboard"]["list"]["leaderboard"][number];

const useLeaderboard = () => {
	const {
		data,
		isLoading: loadingLeaderboard,
		error: errorLeaderboard,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = trpc.student.leaderboard.list.useInfiniteQuery(
		{
			limit: 10, // Number of items per page
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextCursor,
			staleTime: 1000 * 60 * 10, // 10 minutes
		},
	);

	// Flatten the pages into a single array
	const leaderboard = data?.pages.flatMap((page) => page.leaderboard) ?? [];

	return {
		leaderboard,
		loadingLeaderboard,
		errorLeaderboard,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	};
};

export default useLeaderboard;
