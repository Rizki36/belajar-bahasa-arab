import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "sonner";

import { CLIENT_LOCAL_STORAGE_KEYS } from "@/modules/client/constants";
import useCheckBabExist from "@/modules/client/hooks/useCheckBabExist";
import useStudent from "@/modules/client/hooks/useStudent";

import { useLocalStorage } from "../../../common/hooks/useLocalStorage";

const useAccessBab = ({ babNumber }: { babNumber: number }) => {
	const router = useRouter();
	const { student, loadingStudent } = useStudent();
	const [previousOpenedBabNumber, setPreviousOpenedBabNumber] = useLocalStorage(
		CLIENT_LOCAL_STORAGE_KEYS["previousOpenedBabNumber"],
		1,
	);

	const latestBabNumber = student?.latestBab?.number ?? 1;

	const babIsUnlocked = babNumber <= latestBabNumber;

	const { isExist, checkingExist } = useCheckBabExist({
		babNumber,
		enabled: babIsUnlocked,
	});

	const shouldRedirect =
		(!babIsUnlocked && !loadingStudent) || (!isExist && !checkingExist);

	const loading = loadingStudent || (!babIsUnlocked && checkingExist);

	useEffect(() => {
		if (loading) return;

		if (shouldRedirect) {
			toast.warning("Selesaikan bab sebelumnya untuk membuka bab ini");
			router.push(`/belajar/${previousOpenedBabNumber}`);
		}
	}, [shouldRedirect, loading]);

	useEffect(() => {
		if (isExist) setPreviousOpenedBabNumber(babNumber);
	}, [isExist, babNumber]);

	return { loading, shouldRedirect };
};

export default useAccessBab;
