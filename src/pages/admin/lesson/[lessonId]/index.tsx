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
import { NextPageWithLayout } from "@/pages/_app";
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

				<div className="flex items-center gap-x-7 mb-5">
					<div>Acak Soal : {config.randomizeQuestion ? "Ya" : "Tidak"}</div>
					<div>Acak Pertanyaan : {config.randomizeAnswer ? "Ya" : "Tidak"}</div>
					<div>
						<Link href="/admin/setting">
							<Button size="sm" variant="ghost">
								Ubah Pengaturan
							</Button>
						</Link>
					</div>
				</div>

				<QuestionForm lessonId={id} />

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
					lesson={{
						id: lesson?.id || "",
						number: lesson?.number || 0,
					}}
				/>
			</div>
		</>
	);
};

LessonDetailPage.getLayout = (page) => {
	return <AdminMainLayout>{page}</AdminMainLayout>;
};

export default LessonDetailPage;
