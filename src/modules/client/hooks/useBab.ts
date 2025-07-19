import { trpc } from "@/utils/trpc";

const useBab = ({ babNumber }: { babNumber: number }) => {
	const { data, isLoading, error } = trpc.student.learn.bab.useQuery(
		{
			babNumber,
		},
		{
			enabled: !!babNumber,
			staleTime: 60 * 10000, // 10 minute
		},
	);

	return {
		bab: data?.bab,
		isLoading,
		error,
	};
};

export default useBab;
