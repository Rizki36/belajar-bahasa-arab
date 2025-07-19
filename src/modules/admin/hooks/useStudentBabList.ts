import { useMemo } from "react";

import { RouterOutput, trpc } from "@/utils/trpc";

export type StudentBabDataType =
	RouterOutput["admin"]["student"]["listBab"]["docs"][number] & {
		maxProgress: number;
	};

const useStudentBabList = ({ id }: { id: string }) => {
	const { data, isLoading } = trpc.admin.student.listBab.useQuery({
		studentId: id,
	});

	const studentBabList: StudentBabDataType[] = useMemo(() => {
		if (!data?.docs?.length) return [];

		return data?.docs.map((item) => {
			const bab = data?.progressMaxPerBab.find((bab) => bab.babId === item.id);

			return {
				...item,
				maxProgress: bab?.progressMax ?? 0,
			};
		});
	}, [data]);

	return {
		studentBabList,
		loadingStudentBabList: isLoading,
	};
};

export default useStudentBabList;
