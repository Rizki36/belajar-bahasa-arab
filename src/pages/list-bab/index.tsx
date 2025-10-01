import { CaretLeftIcon, ReloadIcon } from "@radix-ui/react-icons";
import type { StepType } from "@reactour/tour";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import TourWrapper from "@/common/components/TourWrapper";
import Button3D from "@/common/components/ui/3d-button";
import { Button } from "@/common/components/ui/button";
import { Progress } from "@/common/components/ui/progress";
import { Spinner } from "@/common/components/ui/spinner";
import { useTourGuide } from "@/common/hooks/useTourGuide";
import ClientMainLayout from "@/common/layouts/MainLayout";
import { cn } from "@/common/utils";
import useBabList from "@/modules/client/hooks/useBabList";
import useStudent from "@/modules/client/hooks/useStudent";
import { trpc } from "@/utils/trpc";
import type { NextPageWithLayout } from "../_app";

const steps: StepType[] = [
	{
		selector: '[data-tut="reactour__bablist"]',
		content: (
			<div className="space-y-3">
				<h3 className="text-lg font-semibold text-gray-800">
					🎉 Selamat datang di halaman List Bab!
				</h3>
				<p className="text-gray-600">
					Ini adalah tempat di mana kamu bisa melihat semua bab yang tersedia
					untuk dipelajari. Setiap bab memiliki progress bar yang menunjukkan
					seberapa jauh kamu sudah belajar.
				</p>
				<div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
					<p className="text-sm text-blue-700">
						💡 <strong>Tips:</strong> Kamu harus menyelesaikan bab sebelumnya
						untuk membuka bab selanjutnya!
					</p>
				</div>
			</div>
		),
		position: "bottom",
	},
	{
		selector: "[data-tut='reactour__progressbar']",
		content: (
			<div className="space-y-3">
				<h3 className="text-lg font-semibold text-gray-800">
					📊 Progress Bar Belajar
				</h3>
				<p className="text-gray-600">
					Progress bar ini menunjukkan berapa persen bab yang sudah kamu
					selesaikan. Semakin penuh, berarti semakin dekat kamu menyelesaikan
					bab tersebut!
				</p>
				<div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-400">
					<p className="text-sm text-green-700">
						🎯 <strong>Goal:</strong> Coba capai 100% untuk setiap bab ya!
					</p>
				</div>
			</div>
		),
		position: "top",
	},
	{
		selector: '[data-tut="reactour__lanjutan"]',
		content: (
			<div className="space-y-3">
				<h3 className="text-lg font-semibold text-gray-800">
					🚀 Tombol Lanjutan
				</h3>
				<p className="text-gray-600">
					Klik tombol ini untuk melanjutkan belajar di bab yang sedang aktif.
					Jika tombol terlihat abu-abu, itu artinya kamu perlu menyelesaikan bab
					sebelumnya dulu.
				</p>
				<div className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-400">
					<p className="text-sm text-yellow-700">
						⚡ <strong>Fun Fact:</strong> Setiap kali kamu menyelesaikan
						pelajaran, progress akan otomatis terupdate!
					</p>
				</div>
			</div>
		),
		position: "top",
	},
	{
		selector: '[data-tut="reactour__kembali"]',
		content: (
			<div className="space-y-3">
				<h3 className="text-lg font-semibold text-gray-800">
					🏠 Tombol Kembali
				</h3>
				<p className="text-gray-600">
					Kalau kamu ingin kembali ke halaman utama belajar, tinggal klik tombol
					"Kembali" ini. Jangan khawatir, progress belajar kamu akan tetap
					tersimpan!
				</p>
				<div className="bg-purple-50 p-3 rounded-lg border-l-4 border-purple-400">
					<p className="text-sm text-purple-700">
						🔄 <strong>Reminder:</strong> Data progress kamu selalu aman dan
						tersimpan!
					</p>
				</div>
			</div>
		),
		position: "bottom",
	},
];

const ListBabPage: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>Mudah belajar ilmu shorof</title>
			</Head>
			<TourWrapper pageId="list-bab-page" steps={steps}>
				<Content />
			</TourWrapper>
		</>
	);
};

const Content = () => {
	const trpcUtils = trpc.useUtils();
	const { mutate } = trpc.student.learn.checkLatestBab.useMutation();
	const [shouldCheckNextBab, setShouldCheckNextBab] = useState(false);

	const { student, loadingStudent } = useStudent();
	const { babList, loadingBabList, errorBabList } = useBabList();

	const { shouldShowTour, setIsOpen } = useTourGuide("list-bab-page");

	useEffect(() => {
		if (!babList.length || loadingStudent || !student) return;

		const latestBab = student?.latestBab
			? babList.find((bab) => {
					return bab.id === student?.latestBab?.id;
				})
			: babList[0];

		if (!latestBab) return;

		if (latestBab.myLesson >= latestBab.totalLesson)
			setShouldCheckNextBab(true);
	}, [student?.latestBab?.id, babList]);

	useEffect(() => {
		if (!shouldCheckNextBab) return;

		mutate(undefined, {
			onSuccess: (data) => {
				if (!data) return;
				setShouldCheckNextBab(false);
				trpcUtils.student.self.student.invalidate();
			},
			onError: (error) => {
				console.error(error);
			},
		});
	}, [shouldCheckNextBab]);

	useEffect(() => {
		if (!loadingBabList && babList.length > 0 && shouldShowTour()) {
			setIsOpen(true, 500);
		}
	}, [loadingBabList]);

	return (
		<div className="md:pt-4 md:mx-12 md:pb-4 mx-4">
			<div className="mb-3">
				<Link
					href={{
						pathname: "/belajar",
					}}
					className="-ml-3 md:-ml-6"
				>
					<Button
						data-tut="reactour__kembali"
						type="button"
						size="sm"
						variant="ghost"
						className="hover:!bg-transparent"
					>
						<CaretLeftIcon /> Kembali
					</Button>
				</Link>
			</div>
			<h1 className="text-3xl text-center md:text-left font-semibold mb-5 md:mb-8">
				List Bab
			</h1>

			{loadingBabList && <Spinner size="medium" />}
			{!loadingBabList && (
				<>
					{errorBabList && (
						<p className="text-center text-red-500">
							{errorBabList?.message ?? "Terjadi kesalahan"}
						</p>
					)}
					{!errorBabList && (
						<div className="w-full lg:w-[700px] space-y-4">
							{babList?.map((bab) => {
								const unlocked =
									(student?.latestBab?.number ?? 1) >= bab.number;

								return (
									<div
										data-tut="reactour__bablist"
										key={bab.id}
										className="rounded-md border p-4"
									>
										<div className="mb-2">
											Bab {bab.number}: {bab.name}
										</div>

										<Progress
											data-tut="reactour__progressbar"
											value={Math.round((bab.myLesson / bab.totalLesson) * 100)}
											className=""
										/>

										<div className="text-sm flex items-center justify-between text-neutral-500 mb-3">
											<span>
												{bab.myLesson} dari {bab.totalLesson} pelajaran
											</span>
											<span>
												{Math.round((bab.myLesson / bab.totalLesson) * 100)}%
											</span>
										</div>

										<div>
											<span className="relative">
												<div
													className={cn({
														"absolute z-10 inset-0": !unlocked,
													})}
													onClick={() => {
														toast.warning(
															"Selesaikan bab sebelumnya untuk membuka bab ini",
														);
													}}
												/>
												<Link
													href={{
														pathname: "/belajar/[babNumber]",
														query: { babNumber: bab.number },
													}}
												>
													<Button3D
														data-tut="reactour__lanjutan"
														type="button"
														size="sm"
														disabled={!unlocked}
														className="relative !cursor-pointer"
													>
														{loadingStudent ? (
															<ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
														) : null}
														Lanjutan
													</Button3D>
												</Link>
											</span>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</>
			)}
		</div>
	);
};

ListBabPage.getLayout = (page) => {
	return <ClientMainLayout>{page}</ClientMainLayout>;
};

export default ListBabPage;
