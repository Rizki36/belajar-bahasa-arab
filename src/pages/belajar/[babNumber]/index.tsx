import Head from "next/head";
import { useRouter } from "next/router";

import { Spinner } from "@/common/components/ui/spinner";
import ClientMainLayout from "@/common/layouts/MainLayout";
import Bab from "@/modules/client/components/belajar";
import useAccessBab from "@/modules/client/hooks/useAccessBab";
import { NextPageWithLayout } from "@/pages/_app";

const SpecificBabPage: NextPageWithLayout = () => {
	const router = useRouter();
	const babNumber = Number(router.query.babNumber as string);

	const { loading, shouldRedirect } = useAccessBab({ babNumber });

	if (loading || shouldRedirect) {
		return (
			<div className="w-full h-screen flex items-center justify-center">
				<Spinner size="large" />
			</div>
		);
	}

	return (
		<>
			<Head>
				<title>Mudah belajar ilmu shorof</title>
			</Head>
			<Bab babNumber={babNumber} />
		</>
	);
};

SpecificBabPage.getLayout = (page) => {
	return <ClientMainLayout>{page}</ClientMainLayout>;
};

export default SpecificBabPage;
