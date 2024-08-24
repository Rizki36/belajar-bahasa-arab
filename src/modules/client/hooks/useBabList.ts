import { trpc } from "@/utils/trpc";

import useStudent from "./useStudent";

const useBabList = () => {
  const { student } = useStudent();
  const { data } = trpc.student.listBab.listBab.useQuery(
    {
      studentId: student?.id!,
    },
    {
      enabled: !!student?.id,
    }
  );
  const babList = data?.docs ?? [];
  return {
    babList,
  };
};

export default useBabList;
