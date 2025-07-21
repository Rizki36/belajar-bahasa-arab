import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { toast } from "sonner";

import { Spinner } from "@/common/components/ui/spinner";
import PdfLesson from "@/modules/client/components/lesson/PdfLesson";
import QuizLesson from "@/modules/client/components/lesson/QuizzLesson";
import VideoLesson from "@/modules/client/components/lesson/VideoLesson";
import useStudent from "@/modules/client/hooks/useStudent";
import { NextPageWithLayout } from "@/pages/_app";
import { trpc } from "@/utils/trpc";

const LessonPage: NextPageWithLayout = () => {
	const router = useRouter();
	const { student } = useStudent();

	const { data, isLoading } = trpc.student.lesson.data.useQuery(
		{
			studentId: student?.id!,
			babNumber: Number(router.query.babNumber),
			subBabNumber: Number(router.query.subBabNumber),
			lessonNumber: Number(router.query.lessonNumber),
		},
		{
			enabled: router.isReady && !!student?.id,
			retry: false,
		},
	);

	// Handle redirection for inaccessible lessons
	useEffect(() => {
		if (data && data.canAccess === false) {
			toast.error(
				"Anda harus menyelesaikan pelajaran sebelumnya terlebih dahulu",
			);
			router.replace(`/belajar/${router.query.babNumber || ""}`);
		}
	}, [data]);

	if (isLoading) {
		return (
			<div className="w-full bg-primary h-screen flex items-center justify-center">
				<Spinner size="large" className="text-white" />
			</div>
		);
	}

	if (
		!data ||
		!data.bab ||
		!data.subBab ||
		!data.lesson ||
		data.canAccess === false
	) {
		return (
			<div className="w-full bg-primary h-screen flex items-center justify-center">
				<Spinner size="large" className="text-white" />
			</div>
		);
	}

	// Render component based on content type
	const renderLessonContent = () => {
		switch (data.lesson.contentType) {
			case "video":
				return (
					<VideoLesson
						videoUrl={data.lesson.videoUrl || ""}
						title={data.lesson.title}
						description={data.lesson.description}
						lessonId={data.lesson.id}
						babNumber={data.bab.number}
					/>
				);
			case "pdf":
				return (
					<PdfLesson
						pdfUrl={data.lesson.pdfUrl || ""}
						title={data.lesson.title}
						description={data.lesson.description}
						lessonId={data.lesson.id}
						babNumber={data.bab.number}
					/>
				);
			case "mixed":
				// For mixed content, just render based on what's available
				if (data.lesson.videoUrl) {
					return (
						<VideoLesson
							videoUrl={data.lesson.videoUrl}
							title={data.lesson.title}
							description={data.lesson.description}
							lessonId={data.lesson.id}
							babNumber={data.bab.number}
						/>
					);
				} else if (data.lesson.pdfUrl) {
					return (
						<PdfLesson
							pdfUrl={data.lesson.pdfUrl}
							title={data.lesson.title}
							description={data.lesson.description}
							lessonId={data.lesson.id}
							babNumber={data.bab.number}
						/>
					);
				}
				// If no media is available, intentionally fall through to quiz
				return null;
			default: // quiz is the default
				return (
					<QuizLesson
						lesson={data.lesson}
						bab={data.bab}
						subBab={data.subBab}
					/>
				);
		}
	};

	return (
		<>
			<Head>
				<title>
					Bab {data.bab.number}: {data.bab.name} -{" "}
					{data.lesson.title || `Pelajaran ${data.lesson.number}`}
				</title>
			</Head>
			{renderLessonContent()}
		</>
	);
};

export default LessonPage;
