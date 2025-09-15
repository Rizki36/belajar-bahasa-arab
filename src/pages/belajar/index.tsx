import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { Spinner } from "@/common/components/ui/spinner";
import ClientMainLayout from "@/common/layouts/MainLayout";
import Lessons from "@/modules/client/components/belajar/Lessons";
import ProfileSection from "@/modules/client/components/belajar/ProfileSection";
import ShareSection from "@/modules/client/components/belajar/ShareSection";
import StatSection from "@/modules/client/components/belajar/StatSection";
import useBabList from "@/modules/client/hooks/useBabList";
import { useMediaQuery } from "@/common/hooks/useMediaQuery";
import type { NextPageWithLayout } from "../_app";

const STATIC_MARGIN_RIGHT = 380;

const LearnPage: NextPageWithLayout = () => {
	const { babList, loadingBabList } = useBabList();
	const isDesktop = useMediaQuery("(min-width: 1024px)");
	const responsiveMarginRight = isDesktop ? STATIC_MARGIN_RIGHT : 0;
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [activeTitle, setActiveTitle] = useState<string>("");
	const [activeBabNumber, setActiveBabNumber] = useState<number | null>(null);

	useEffect(() => {
		if (babList.length) {
			setActiveTitle(`Bab ${babList[0].number} - ${babList[0].name}`);
			setActiveBabNumber(babList[0].number);
		}
	}, [babList]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		if (loadingBabList) return;

		const sections = Array.from(
			container.querySelectorAll<HTMLElement>("[data-bab-id]"),
		);
		if (!sections.length) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						const el = entry.target as HTMLElement;
						const title = el.dataset.title;
						const babNumStr = el.dataset.babNumber;
						if (title) setActiveTitle(title);
						if (babNumStr) setActiveBabNumber(Number(babNumStr));
					}
				}
			},
			{
				root: null,
				// Trigger when the section crosses the vertical center of the viewport
				rootMargin: "-50% 0px -50% 0px",
				threshold: 0,
			},
		);

		sections.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, [babList.length, loadingBabList]);

	if (loadingBabList) {
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

			{/* Sticky top row: header (left) and right sidebar (right) */}
			<div className="top-0 sticky z-10">
				<div className="bg-white h-3 lg:h-6" />
				<div className="mx-4 mb-6">
					<div className="flex gap-4 lg:gap-6">
						{/* Header card */}
						<div
							className="flex-1"
							style={{
								marginRight: `${responsiveMarginRight}px`,
							}}
						>
							<div className="bg-[#692fce] rounded-xl overflow-hidden shadow-lg">
								<div className="flex items-center justify-between mb-2 bg-primary text-left text-white px-4 py-4">
									<div className="leading-none text-sm md:text-lg">
										{activeTitle}
									</div>
								</div>
							</div>
						</div>

						{/* Right sidebar beside header (desktop) */}
						<div className="absolute top-6 right-6 hidden lg:flex lg:w-[330px] pl-0">
							<div className="flex h-svh top-0 flex-col flex-1">
								<div className="lg:mb-6">
									<ProfileSection />
								</div>
								<div className="lg:block">
									{activeBabNumber ? (
										<StatSection babNumber={activeBabNumber} />
									) : null}
								</div>
								<div className="hidden lg:block">
									<ShareSection url={window?.location?.href ?? ""} />
								</div>
								<div className="text-xs text-neutral-500 hidden lg:block">
									<div>Disusun oleh:</div>
									<div>Abdul Ghofur, S.Pd.I., M.Pd.</div>
									<div>Siti Durotun Naseha, M.Pd</div>
									<div>Sri Widoyoningrum, ST., M.Pd</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Main content below the sticky row */}
			<div
				className="flex-1 relative flex flex-col lg:py-4 lg:mx-8 xl:mx-12"
				style={{
					marginRight: `${responsiveMarginRight}px`,
				}}
			>
				<div ref={containerRef} className="flex flex-col gap-10">
					{babList.map((bab, index) => (
						<section
							key={bab.id}
							data-bab-id={bab.id}
							data-bab-number={`${bab.number}`}
							data-title={`Bab ${bab.number} - ${bab.name}`}
							className="flex-1 relative flex flex-col"
						>
							{/* Divider for each bab except the first */}
							{index !== 0 ? (
								<div className="flex w-full items-center my-8">
									<hr className="flex-1" />
									<h2 className="mx-3 text-neutral-500 leading-[24px]">
										Bab {bab.number} - {bab.name}
									</h2>
									<hr className="flex-1" />
								</div>
							) : null}

							{/* Render all sub-bab and lessons for this bab */}
							<Lessons babNumber={bab.number} />
						</section>
					))}
				</div>
			</div>
		</>
	);
};

LearnPage.getLayout = (page) => {
	return <ClientMainLayout>{page}</ClientMainLayout>;
};

export default LearnPage;
