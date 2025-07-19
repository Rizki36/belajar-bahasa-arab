import { trpc } from "@/utils/trpc";

const useStudentCount = () => {
	const { data, isLoading } = trpc.admin.dashboard.studentCount.useQuery();

	return {
		studentCount: data?.count ?? 0,
		loadingStudentCount: isLoading,
	};
};

export default useStudentCount;
