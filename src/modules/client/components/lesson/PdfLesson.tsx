import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { type FC, useEffect, useState } from "react";
import { toast } from "sonner";
import Button3D from "@/common/components/ui/3d-button";
import { Button } from "@/common/components/ui/button";
import { Spinner } from "@/common/components/ui/spinner";
import ShareSection from "@/modules/client/components/belajar/ShareSection";
import useStudent from "@/modules/client/hooks/useStudent";
import { trpc } from "@/utils/trpc";

type PdfLessonProps = {
	pdfUrl: string;
	title: string | null;
	description: string | null;
	lessonId: string;
	babNumber: number;
};

const PdfLesson: FC<PdfLessonProps> = ({
	pdfUrl,
	title,
	description,
	lessonId,
	babNumber,
}) => {
	const [loading, setLoading] = useState(false);
	const [iframeLoading, setIframeLoading] = useState(true);
	const [completed, setCompleted] = useState(false);
	const { student } = useStudent();
	const trpcUtils = trpc.useUtils();
	const [isMounted, setIsMounted] = useState(false);

	// Convert the Google Drive URL to an embeddable format if needed
	const getEmbedUrl = (url: string) => {
		// Check if it's a Google Drive link and convert it to embed format
		if (url.includes("drive.google.com/file/d/")) {
			// Extract the file ID
			const fileIdMatch = url.match(/\/file\/d\/([^/]+)/);
			if (fileIdMatch && fileIdMatch[1]) {
				return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
			}
		}

		// If it's already in preview format or not a Google Drive link
		return url;
	};

	const embedUrl = getEmbedUrl(pdfUrl);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const { mutate: submitPdfCompletion } =
		trpc.student.lesson.submitVideoOrPdf.useMutation({
			onSuccess: () => {
				setCompleted(true);
				setLoading(false);
				toast.success("Materi telah selesai");
				// Invalidate queries to update UI
				trpcUtils.student.learn.subBabList.invalidate();
				trpcUtils.student.listBab.listBab.invalidate();
			},
			onError: (error) => {
				setLoading(false);
				toast.error(error.message || "Terjadi kesalahan");
				console.error(error);
			},
		});

	const handleComplete = () => {
		if (!student?.id) {
			toast.error("Tidak dapat menemukan data siswa");
			return;
		}

		setLoading(true);
		submitPdfCompletion({
			studentId: student.id,
			lessonId: lessonId,
		});
	};

	return (
		<div className="bg-primary min-h-screen px-4 z-30 md:px-11">
			<div className="pt-6 sticky top-0 flex items-center justify-between z-50 md:mb-2 bg-primary">
				<Link href="/belajar">
					<Button variant="ghost" className="text-white">
						Keluar
					</Button>
				</Link>
			</div>

			<div className="flex flex-col gap-y-5 gap-x-12 pb-6 max-w-screen-lg w-full mx-auto">
				<div className="bg-white py-6 xl:pb-0 rounded-xl">
					<div className="flex flex-col items-center p-8">
						{title && (
							<h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
						)}

						<div className="w-full border rounded-lg p-4 bg-white shadow">
							{isMounted ? (
								<div className="relative">
									{iframeLoading && (
										<div className="absolute inset-0 flex justify-center items-center">
											<Spinner size="large" />
										</div>
									)}
									<iframe
										src={embedUrl}
										className="w-full min-h-[500px] md:min-h-[650px]"
										onLoad={() => setIframeLoading(false)}
										allow="autoplay; encrypted-media;"
										style={{ border: 0 }}
									></iframe>
								</div>
							) : (
								<div className="flex justify-center p-8 min-h-[400px] items-center">
									<Spinner size="large" />
								</div>
							)}
						</div>

						{description && (
							<div className="text-lg mt-4 text-center">{description}</div>
						)}
					</div>
					<ShareSection
						url={isMounted ? window?.location?.href : ""}
						variant="ghost"
						className="border-none hidden xl:flex"
					/>
				</div>

				<div className="flex flex-col justify-center">
					<Button3D
						type="button"
						variant={completed ? "success" : "white"}
						className="w-full"
						frontClassName="!py-8 text-lg font-semibold"
						onClick={handleComplete}
						disabled={loading || completed}
					>
						{loading ? (
							<ReloadIcon className="mr-2 size-6 animate-spin" />
						) : completed ? (
							"Selesai"
						) : (
							"Tandai Selesai"
						)}
					</Button3D>

					{completed && (
						<div className="text-white text-center mt-4">
							Anda telah menyelesaikan materi ini. Silakan lanjutkan ke
							pelajaran berikutnya.
						</div>
					)}

					<Link href={`/belajar/${babNumber}`} className="mt-6">
						<Button
							variant="outline"
							className="w-full bg-white/10 text-white hover:bg-white/20"
						>
							Kembali ke Daftar Pelajaran
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default PdfLesson;
