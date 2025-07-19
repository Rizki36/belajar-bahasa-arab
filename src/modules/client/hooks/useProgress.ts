import { trpc } from "@/utils/trpc";

import useStudent from "./useStudent";

const useProgress = ({ babId }: { babId: string }) => {
	const { student } = useStudent();
	const { data } = trpc.student.self.progress.useQuery(
		{
			studentId: student?.id!,
			babId,
		},
		{
			enabled: !!student?.id && !!babId,
		},
	);

	// round to 0 decimal
	const progress = data?.totalLesson
		? Math.round((data.myLesson / data.totalLesson) * 100)
		: 0;

	return {
		progress: progress,
		myLesson: data?.myLesson ?? 0,
		totalLesson: data?.totalLesson ?? 0,
	};
};

export default useProgress;
