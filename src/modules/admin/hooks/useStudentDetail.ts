import { type RouterOutput, trpc } from "@/utils/trpc";

export type StudentDataType =
	RouterOutput["admin"]["student"]["list"]["docs"][number];

const useStudentDetail = ({ id }: { id: string }) => {
	const { data, isLoading } = trpc.admin.student.detail.useQuery({
		id,
	});

	const student = data?.doc;

	return {
		student,
		loadingStudent: isLoading,
	};
};

export default useStudentDetail;
