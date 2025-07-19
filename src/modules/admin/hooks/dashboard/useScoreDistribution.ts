import { trpc } from "@/utils/trpc";

const useScoreDistribution = () => {
	const { data, isLoading } = trpc.admin.dashboard.scoreDistribution.useQuery();

	return {
		scoreDistribution: data?.docs ?? [],
		loadingScoreDistribution: isLoading,
	};
};

export default useScoreDistribution;
