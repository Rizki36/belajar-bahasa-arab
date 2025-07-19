import { trpc } from "@/utils/trpc";

const useLeaderBoard = () => {
	const { data, isLoading: loadingLeaderBoard } =
		trpc.admin.dashboard.leaderBoard.useQuery();

	return {
		leaderBoard: data?.docs ?? [],
		loadingLeaderBoard,
	};
};

export default useLeaderBoard;
