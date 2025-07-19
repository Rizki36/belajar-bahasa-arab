import { inferRouterOutputs } from "@trpc/server";

import { AppRouter } from "@/server/routers/_app";
import { trpc } from "@/utils/trpc";

import useBab from "./useBab";
import useStudent from "./useStudent";

export type SubBabWithLesson =
	inferRouterOutputs<AppRouter>["student"]["learn"]["subBabList"]["subBabList"][number];

const useSubBabList = ({ babNumber }: { babNumber: number }) => {
	const { student } = useStudent();
	const { bab } = useBab({ babNumber });
	const {
		data,
		isLoading: loadingSubBabList,
		error: errorSubBabList,
	} = trpc.student.learn.subBabList.useQuery(
		{
			babId: bab?.id!,
			studentId: student?.id!,
		},
		{
			enabled: !!bab && !!student,
			staleTime: 60 * 10000, // 10 minute
		},
	);

	return {
		subBabList: data?.subBabList ?? [],
		loadingSubBabList,
		errorSubBabList,
	};
};

export default useSubBabList;
