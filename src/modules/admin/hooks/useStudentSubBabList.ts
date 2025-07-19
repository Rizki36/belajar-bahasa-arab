import { useMemo } from "react";

import { RouterOutput, trpc } from "@/utils/trpc";

export type StudentSubBabDataType =
	RouterOutput["admin"]["student"]["listSubBab"]["docs"][number] & {
		maxProgress: number;
	};

const useStudentSubBabList = ({
	studentId,
	babId,
}: {
	studentId: string;
	babId: string;
}) => {
	const { data, isLoading } = trpc.admin.student.listSubBab.useQuery(
		{
			studentId,
			babId,
		},
		{
			enabled: !!babId && !!studentId,
		},
	);

	const studentSubBabList: StudentSubBabDataType[] = useMemo(() => {
		if (!data?.docs?.length) return [];

		return data?.docs.map((item) => {
			const subBab = data?.progressMaxPerSubBab.find(
				(subBab) => subBab.subBabId === item.id,
			);

			return {
				...item,
				maxProgress: subBab?.progressMax ?? 0,
			};
		});
	}, [data]);

	return {
		studentSubBabList,
		loadingStudentSubBabList: isLoading,
	};
};

export default useStudentSubBabList;
