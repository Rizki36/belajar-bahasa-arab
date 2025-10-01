import { type StepType, useTour } from "@reactour/tour";
import { useEffect } from "react";
import TourWrapper from "@/common/components/TourWrapper";
import { useTourGuide } from "@/common/hooks/useTourGuide";
import { cn } from "@/common/utils";
import Header from "./Header";
import Lessons from "./Lessons";
import ProfileSection from "./ProfileSection";
import ShareSection from "./ShareSection";
import StatSection from "./StatSection";

type BabProps = {
	babNumber: number;
};
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

const Content = (props: BabProps) => {
	const { babNumber } = props;

	return (
		<section className="min-h-svh flex flex-col-reverse lg:flex-row">
			<div
				className={cn(
					"flex-1 relative flex flex-col",
					"lg:py-4 lg:mx-8 xl:mx-12",
				)}
			>
				<Header babNumber={babNumber} />
				<Lessons babNumber={babNumber} />
			</div>
			<div
				className={cn(
					"flex",
					"relative flex-col lg:w-[330px] pl-4 pb-0 pt-4 pr-4 lg:pr-6 lg:pl-0 lg:pb-6",
				)}
			>
				<div className="h-6 hidden lg:block"></div>
				<div className="flex sticky h-svh top-0 flex-col flex-1">
					<div className="lg:mb-6">
						<ProfileSection />
					</div>
					<div className=" lg:block">
						<StatSection babNumber={babNumber} />
					</div>
					<div className="hidden lg:block">
						<ShareSection url={window?.location?.href ?? ""} />
					</div>
					<div
						data-tut="reactour__credits"
						className="text-xs text-neutral-500 hidden lg:block"
					>
						<div>Disusun oleh:</div>
						<div>Abdul Ghofur, S.Pd.I., M.Pd.</div>
						<div>Siti Durotun Naseha, M.Pd</div>
						<div>Sri Widoyoningrum, ST., M.Pd</div>
					</div>
				</div>
			</div>
		</section>
	);
};

const Bab = (props: BabProps) => {
	return (
		<TourWrapper
			pageId="belajar-page"
			steps={steps}
			className="reactour-custom"
		>
			<Content {...props} />
		</TourWrapper>
	);
};

export default Bab;
