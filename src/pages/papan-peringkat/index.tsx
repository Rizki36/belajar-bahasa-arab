import type { StepType } from "@reactour/tour";
import Head from "next/head";
import Image from "next/image";
import { type FC, useEffect, useRef } from "react";
import TourWrapper from "@/common/components/TourWrapper";
import { Button } from "@/common/components/ui/button";
import { Spinner } from "@/common/components/ui/spinner";
import { useTourGuide } from "@/common/hooks/useTourGuide";
import ClientMainLayout from "@/common/layouts/MainLayout";
import { cn } from "@/common/utils";
import useLeaderboard, {
	type LeaderboardItem,
} from "@/modules/client/hooks/useLeaderboard";
import type { NextPageWithLayout } from "../_app";

const leaderboardSteps: StepType[] = [
	{
		selector: '[data-tut="ranking-list"]',
		content: (
			<div className="text-center">
				<h3 className="text-lg font-bold text-gray-800 mb-2">🏅 Top 3 Siswa</h3>
				<p className="text-gray-600 text-sm">
					Lihat siapa saja 3 siswa terbaik di papan peringkat ini. Mereka adalah
					siswa yang telah mengumpulkan poin tertinggi melalui kuis-kuis yang
					dikerjakan.
				</p>
			</div>
		),
	},
];

const useInfiniteLeaderboard = () => {
	const {
		leaderboard,
		loadingLeaderboard,
		errorLeaderboard,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useLeaderboard();

	// Observer for infinite scroll
	const observerTarget = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 1.0 },
		);

		if (observerTarget.current) {
			observer.observe(observerTarget.current);
		}

		return () => {
			if (observerTarget.current) {
				observer.unobserve(observerTarget.current);
			}
		};
	}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

	return {
		leaderboard,
		loadingLeaderboard,
		errorLeaderboard,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		observerTarget,
	};
};

const LeaderBoardPage: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>Mudah belajar ilmu shorof</title>
			</Head>
			<TourWrapper pageId="leaderboard-page" steps={leaderboardSteps}>
				<Content />
			</TourWrapper>
		</>
	);
};

const Content = () => {
	const {
		leaderboard,
		loadingLeaderboard,
		errorLeaderboard,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		observerTarget,
	} = useInfiniteLeaderboard();

	const { shouldShowTour, setIsOpen } = useTourGuide("leaderboard-page");

	useEffect(() => {
		if (!loadingLeaderboard && leaderboard.length > 0 && shouldShowTour()) {
			setIsOpen(true, 500);
		}
	}, [loadingLeaderboard]);

	return (
		<div className="mx-auto w-full py-12 px-6">
			<h1 className="text-xl font-bold text-primary text-center mb-8">
				Papan Peringkat
			</h1>

			{loadingLeaderboard && leaderboard.length === 0 ? (
				<Spinner />
			) : (
				<>
					{!!errorLeaderboard && (
						<p className="text-center text-red-500">
							{errorLeaderboard?.message ?? "Terjadi kesalahan"}
						</p>
					)}

					{!!leaderboard.length && (
						<>
							<div
								data-tut="ranking-list"
								className="grid grid-cols-3 max-w-[700px] mx-auto justify-center gap-x-4 md:gap-x-12 mb-16"
							>
								{leaderboard[1] ? (
									<TopStudent position={2} leaderboard={leaderboard[1]} />
								) : (
									<div></div>
								)}
								{leaderboard[0] ? (
									<TopStudent position={1} leaderboard={leaderboard[0]} />
								) : (
									<div></div>
								)}
								{leaderboard[2] ? (
									<TopStudent position={3} leaderboard={leaderboard[2]} />
								) : (
									<div></div>
								)}
							</div>

							<div className="mx-auto w-full flex flex-col items-center gap-y-4">
								{leaderboard.slice(3).map((item, index) => (
									<div
										key={`leaderboard-${index}`}
										className="flex bg-primary w-full md:max-w-[600px] items-center rounded-xl"
									>
										<div className="w-9 -rotate-90 flex items-center justify-center rounded-full text-white bg-primary">
											{index + 4}
										</div>
										<div className="flex flex-1 items-center justify-between pr-4 py-1 text-white">
											<div className="flex items-center">
												<Image
													width={32}
													height={32}
													src={item?.image ?? ""}
													alt="Profile"
													className="size-16 border rounded-full"
												/>
												<div className="text-center text-lg font-semibold ml-3">
													{item?.name}
												</div>
											</div>
											<div className="text-center text-lg font-semibold">
												{item?.score}
											</div>
										</div>
									</div>
								))}

								{/* Intersection observer target */}
								<div ref={observerTarget} className="h-4 w-full" />

								{/* Loading indicator for next page */}
								{isFetchingNextPage && (
									<div className="py-4">
										<Spinner />
									</div>
								)}

								{/* Manual load more button as fallback */}
								{hasNextPage && !isFetchingNextPage && (
									<Button onClick={() => fetchNextPage()} className="mt-4">
										Muat Lebih Banyak
									</Button>
								)}
							</div>
						</>
					)}

					{!leaderboard.length && !loadingLeaderboard && (
						<p className="text-center text-neutral-500">Belum ada data</p>
					)}
				</>
			)}
		</div>
	);
};

const TopStudent: FC<{
	position: number;
	leaderboard?: LeaderboardItem;
}> = ({ position, leaderboard }) => {
	return (
		<div
			className={cn("relative overflow-hidden", {
				"mt-8": position !== 1,
			})}
		>
			<div
				className={cn(
					"border relative mx-auto shadow-md rounded-full overflow-hidden",
					{
						"size-[56px] md:size-[120px] text-base": position === 1,
						"size-[46px] md:size-[100px] text-sm": position !== 1,
					},
				)}
			>
				<Image
					width={120}
					height={120}
					src={leaderboard?.image ?? ""}
					alt="Profile"
				/>
				<div className="w-[100%] h-[90%] bottom-[-50%] md:bottom-[-70%] mx-auto left-0 right-0 absolute bg-primary rounded-full">
					<div className="text-white text-center mx-auto text-xs">
						{position}
					</div>
				</div>
			</div>
			<div className="text-center text-xs md:text-lg font-semibold text-primary mt-2">
				{leaderboard?.name}
			</div>
			<div
				className={cn(
					"text-center text-xs md:text-lg font-semibold text-primary",
				)}
			>
				{leaderboard?.score}
			</div>
		</div>
	);
};

LeaderBoardPage.getLayout = (page) => {
	return <ClientMainLayout>{page}</ClientMainLayout>;
};

export default LeaderBoardPage;
