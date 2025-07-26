import { ReloadIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Link from "next/link";
import { type FC, useEffect, useState } from "react";
import { toast } from "sonner";
import Button3D from "@/common/components/ui/3d-button";
import { Button } from "@/common/components/ui/button";
import { Spinner } from "@/common/components/ui/spinner";
import { useMediaQuery } from "@/common/hooks/useMediaQuery";
import ShareSection from "@/modules/client/components/belajar/ShareSection";
import useStudent from "@/modules/client/hooks/useStudent";
import { trpc } from "@/utils/trpc";

// Dynamically import the PDF components with ssr disabled
const PDFComponents = dynamic(() => import("./PDFComponents"), { ssr: false });

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
	const [numPages, setNumPages] = useState<number | null>(null);
	const [pageNumber, setPageNumber] = useState(1);
	const [loading, setLoading] = useState(false);
	const [pdfLoading, setPdfLoading] = useState(true);
	const [completed, setCompleted] = useState(false);
	const { student } = useStudent();
	const trpcUtils = trpc.useUtils();
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
		setNumPages(numPages);
		setPdfLoading(false);
	}

	const { mutate: submitPdfCompletion } =
		trpc.student.lesson.submitLessonVideo.useMutation({
			onSuccess: () => {
				setCompleted(true);
				setLoading(false);
				toast.success("PDF telah ditandai selesai");
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
		<div className="bg-primary min-h-screen px-4 md:px-11">
			<div className="pt-6 sticky top-0 flex items-center justify-between md:mb-2">
				<Link href="/belajar">
					<Button variant="ghost" className="text-white">
						Keluar
					</Button>
				</Link>
			</div>

			<div className="grid gap-y-5 xl:grid-cols-[700px,1fr] gap-x-12 pb-6">
				<div className="flex sticky bg-primary top-0 pt-3 md:pt-0 z-50 flex-col-reverse xl:flex-col">
					<div className="bg-white py-6 xl:pb-0 rounded-xl">
						<div className="flex flex-col items-center p-8">
							{title && (
								<h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
							)}

							<div className="w-full border rounded-lg p-4 bg-white shadow">
								{isMounted ? (
									<PDFComponents
										pdfUrl={pdfUrl}
										pageNumber={pageNumber}
										onDocumentLoadSuccess={onDocumentLoadSuccess}
										isDesktop={isDesktop}
										pdfLoading={pdfLoading}
										numPages={numPages}
										setPageNumber={setPageNumber}
									/>
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
							Anda telah menyelesaikan materi PDF ini. Silakan lanjutkan ke
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
