import { trpc } from "@/utils/trpc";

const useCheckBabExist = ({
	babNumber,
	enabled = true,
}: {
	babNumber: number;
	enabled?: boolean;
}) => {
	const { data, isLoading } = trpc.student.learn.isBabExist.useQuery(
		{
			babNumber,
		},
		{
			enabled: !!babNumber && enabled,
			staleTime: 60 * 10000, // 10 minute
		},
	);

	const isExist = data?.isExist;

	return {
		isExist,
		checkingExist: isLoading,
	};
};

export default useCheckBabExist;
