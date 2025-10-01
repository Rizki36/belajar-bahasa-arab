import type { StepType } from "@reactour/tour";
import Head from "next/head";
import { useRouter } from "next/router";
import TourWrapper from "@/common/components/TourWrapper";
import { Spinner } from "@/common/components/ui/spinner";
import ClientMainLayout from "@/common/layouts/MainLayout";
import Bab from "@/modules/client/components/belajar";
import useAccessBab from "@/modules/client/hooks/useAccessBab";
import type { NextPageWithLayout } from "@/pages/_app";

const steps: StepType[] = [
	{
		selector: '[data-tut="reactour__pdf"]',
		content: (
			<div className="text-center">
				<h3 className="text-lg font-bold text-gray-800 mb-2">📖 Baca Materi</h3>
				<p className="text-gray-600 text-sm">
					Ini adalah bagian materi pembelajaran. Baca materi terlebih dahulu
					sebelum mengerjakan kuis untuk memahami pelajaran dengan baik.
				</p>
			</div>
		),
	},
	{
		selector: '[data-tut="reactour__quiz"]',
		content: (
			<div className="text-center">
				<h3 className="text-lg font-bold text-gray-800 mb-2">
					⭐ Kuis & Video
				</h3>
				<p className="text-gray-600 text-sm">
					Setelah membaca materi, kerjakan kuis atau tonton video pembelajaran.
					Kumpulkan bintang untuk membuka pelajaran berikutnya!
				</p>
			</div>
		),
	},
	{
		selector: '[data-tut="reactour__credits"]',
		content: (
			<div className="text-center">
				<h3 className="text-lg font-bold text-gray-800 mb-2">
					👨‍🏫 Tim Penyusun
				</h3>
				<p className="text-gray-600 text-sm">
					Aplikasi ini disusun oleh tim ahli pendidikan bahasa Arab yang
					berpengalaman. Selamat belajar!
				</p>
			</div>
		),
	},
];

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
			<TourWrapper pageId="belajar-page" steps={steps}>
				<Bab babNumber={babNumber} />
			</TourWrapper>
		</>
	);
};

SpecificBabPage.getLayout = (page) => {
	return <ClientMainLayout>{page}</ClientMainLayout>;
};

export default SpecificBabPage;
