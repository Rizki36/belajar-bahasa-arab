import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { Button } from "@/common/components/ui/button";
import { Card } from "@/common/components/ui/card";
import { Spinner } from "@/common/components/ui/spinner";
import useSystemSetting from "@/common/hooks/useSystemSetting";
import DeleteLessonButton from "@/modules/admin/components/lesson/DeleteButton";
import LessonFormDialog from "@/modules/admin/components/lesson/FormDialog";
import QuestionForm from "@/modules/admin/components/lesson/QuestionForm";
import AdminMainLayout from "@/modules/admin/layouts/MainLayout";
import type { NextPageWithLayout } from "@/pages/_app";
import { trpc } from "@/utils/trpc";

const LessonDetailPage: NextPageWithLayout = () => {
	const router = useRouter();
	const { config } = useSystemSetting();
	const [lessonDialog, setLessonDialog] = React.useState({
		open: false,
		mode: "create" as "create" | "update",
	});

	const id = router.query.lessonId as string;

	const { data: lessonData, isLoading } = trpc.admin.lesson.list.useQuery(
		{
			id,
			with: ["bab", "subBab"],
		},
		{
			enabled: router.isReady,
		},
	);
	const lesson = lessonData?.items?.[0];

	if (isLoading) {
		return (
			<div className="w-full h-screen flex items-center justify-center">
				<Spinner size="large" />
			</div>
		);
	}

	if (!lesson) {
		router.replace("/admin/bab");
		return (
			<div className="w-full h-screen flex items-center justify-center"></div>
		);
	}

	return (
		<>
			<Head>
				<title>Mudah belajar ilmu shorof</title>
			</Head>
			<div>
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center relative">
						<Link
							href={{
								pathname: "/admin/sub-bab/[subBabId]",
								query: { subBabId: lesson?.subBab.id },
							}}
							className="left-0 translate-x-[-100%] absolute"
						>
							<Button type="button" size="sm" variant="ghost">
								<ArrowLeftIcon />
							</Button>
						</Link>
						<h1 className="text-3xl font-semibold">Detail Pelajaran</h1>
					</div>
					<div className="space-x-2">
						<Button
							size="sm"
							variant="ghost"
							onClick={() => {
								setLessonDialog({ mode: "update", open: true });
							}}
						>
							Edit
						</Button>
						<DeleteLessonButton />
					</div>
				</div>

				<div className="mb-8 flex gap-x-3">
					<Card className="w-auto p-6 flex-col">
						<div className="text-xs font-medium">Nomor Pelajaran</div>
						<div className="text-3xl font-bold text-center">
							{lesson?.number}
						</div>
					</Card>

					<div>
						<div className="text-sm">Nama Bab</div>
						<div className="text-2xl mb-2">{lesson?.bab?.name}</div>

						<div className="text-sm">Nama Sub Bab</div>
						<div className="text-2xl">
							{lesson?.subBab?.name || "{Tanpa sub bab}"}
						</div>
					</div>
				</div>

				{lesson.contentType === "quiz" || lesson.contentType === "mixed" ? (
					<div className="flex items-center gap-x-7 mb-5">
						<div>Acak Soal : {config.randomizeQuestion ? "Ya" : "Tidak"}</div>
						<div>
							Acak Pertanyaan : {config.randomizeAnswer ? "Ya" : "Tidak"}
						</div>
						<div>
							<Link href="/admin/setting">
								<Button size="sm" variant="ghost">
									Ubah Pengaturan
								</Button>
							</Link>
						</div>
					</div>
				) : null}

				{(lesson?.contentType === "quiz" ||
					lesson?.contentType === "mixed") && <QuestionForm lessonId={id} />}

				{(lesson?.contentType === "pdf" ||
					lesson?.contentType === "video" ||
					lesson?.contentType === "mixed") && (
					<Card className="p-6 mb-8">
						<div className="flex flex-col gap-4">
							{lesson.title && (
								<div>
									<div className="text-sm font-medium mb-1">Judul</div>
									<div className="text-xl">{lesson.title}</div>
								</div>
							)}

							{lesson.description && (
								<div>
									<div className="text-sm font-medium mb-1">Deskripsi</div>
									<div className="text-base">{lesson.description}</div>
								</div>
							)}

							{lesson.contentType === "pdf" || lesson.contentType === "mixed"
								? lesson.pdfUrl && (
										<div>
											<div className="text-sm font-medium mb-1">URL PDF</div>
											<div className="text-base break-all">
												<a
													href={lesson.pdfUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-600 hover:underline"
												>
													{lesson.pdfUrl}
												</a>
											</div>
										</div>
									)
								: null}

							{lesson.contentType === "video" || lesson.contentType === "mixed"
								? lesson.videoUrl && (
										<div>
											<div className="text-sm font-medium mb-1">URL Video</div>
											<div className="text-base break-all">
												<a
													href={lesson.videoUrl}
													target="_blank"
													rel="noopener noreferrer"
													className="text-blue-600 hover:underline"
												>
													{lesson.videoUrl}
												</a>
											</div>
										</div>
									)
								: null}
						</div>
					</Card>
				)}

				<LessonFormDialog
					mode={lessonDialog.mode}
					open={lessonDialog.open}
					setOpen={(isOpen) =>
						setLessonDialog((prev) => ({ ...prev, open: isOpen }))
					}
					bab={{
						id: lesson?.bab.id || "",
					}}
					subBab={{
						id: lesson?.subBab.id || "",
					}}
					lesson={lesson}
				/>
			</div>
		</>
	);
};

LessonDetailPage.getLayout = (page) => {
	return <AdminMainLayout>{page}</AdminMainLayout>;
};

export default LessonDetailPage;
