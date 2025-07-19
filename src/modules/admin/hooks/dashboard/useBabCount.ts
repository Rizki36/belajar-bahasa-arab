import { trpc } from "@/utils/trpc";

const useBabCount = () => {
	const { data, isLoading: loadingBabCount } =
		trpc.admin.dashboard.babCount.useQuery();

	return {
		babCount: data?.count ?? 0,
		loadingBabCount,
	};
};

export default useBabCount;
