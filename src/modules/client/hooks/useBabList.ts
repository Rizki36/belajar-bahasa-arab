import { trpc } from "@/utils/trpc";

import useStudent from "./useStudent";

const useBabList = () => {
	const { student } = useStudent();
	const {
		data,
		isLoading: loadingBabList,
		error: errorBabList,
	} = trpc.student.listBab.listBab.useQuery(
		{
			studentId: student?.id!,
		},
		{
			enabled: !!student?.id,
			staleTime: 60 * 10000, // 10 minute
		},
	);
	const babList = data?.docs ?? [];
	return {
		babList,
		loadingBabList,
		errorBabList,
	};
};

export default useBabList;
