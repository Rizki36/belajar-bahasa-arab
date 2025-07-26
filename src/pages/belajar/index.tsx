import { useRouter } from "next/router";
import { useEffect } from "react";

import { Spinner } from "@/common/components/ui/spinner";
import { useLocalStorage } from "@/common/hooks/useLocalStorage";
import ClientMainLayout from "@/common/layouts/MainLayout";
import { CLIENT_LOCAL_STORAGE_KEYS } from "@/modules/client/constants";
import useStudent from "@/modules/client/hooks/useStudent";

import type { NextPageWithLayout } from "../_app";

const LearnPage: NextPageWithLayout = () => {
	const router = useRouter();
	const [previousOpenedBabNumber, setPreviousOpenedBabNumber] = useLocalStorage<
		number | null
	>(CLIENT_LOCAL_STORAGE_KEYS["previousOpenedBabNumber"], null);

	const { student, loadingStudent } = useStudent({
		enabled: !previousOpenedBabNumber,
	});

	useEffect(() => {
		if (previousOpenedBabNumber) {
			router.push({
				pathname: "/belajar/[babNumber]",
				query: { babNumber: previousOpenedBabNumber },
			});
			return;
		}

		const latestBabNumber = student?.latestBab?.number ?? 1;

		if (!loadingStudent && latestBabNumber) {
			setPreviousOpenedBabNumber(latestBabNumber);
			router.push({
				pathname: "/belajar/[babNumber]",
				query: {
					babNumber: latestBabNumber,
				},
			});
		}
	}, [previousOpenedBabNumber]);

	if (loadingStudent) {
		return (
			<div className="w-full h-screen flex items-center justify-center">
				<Spinner size="large" />
			</div>
		);
	}

	return <></>;
};

LearnPage.getLayout = (page) => {
	return <ClientMainLayout>{page}</ClientMainLayout>;
};

export default LearnPage;
