import { type RouterOutput, trpc } from "@/utils/trpc";

export type StudentDataType =
	RouterOutput["admin"]["student"]["list"]["docs"][number];

const useStudentList = ({ skip, limit }: { skip: number; limit: number }) => {
	const { data, isLoading } = trpc.admin.student.list.useQuery({
		limit,
		offset: skip,
	});

	const studentList = data?.docs ?? [];

	return {
		studentList,
		loadingStudentList: isLoading,
	};
};

export default useStudentList;
