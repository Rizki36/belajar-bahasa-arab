import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { FC, useState } from "react";
import { toast } from "sonner";
import Button3D from "@/common/components/ui/3d-button";
import { Button } from "@/common/components/ui/button";
import ShareSection from "@/modules/client/components/belajar/ShareSection";
import useStudent from "@/modules/client/hooks/useStudent";
import { trpc } from "@/utils/trpc";

type VideoLessonProps = {
	videoUrl: string;
	title: string | null;
	description: string | null;
	lessonId: string;
	babNumber: number;
};

const VideoLesson: FC<VideoLessonProps> = ({
	videoUrl,
	title,
	description,
	lessonId,
	babNumber,
}) => {
	const [completed, setCompleted] = useState(false);
	const [loading, setLoading] = useState(false);
	const { student } = useStudent();
	const trpcUtils = trpc.useUtils();

	// Extract video ID from YouTube URL
	const getYoutubeId = (url: string) => {
		const regExp =
			/^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
		const match = url.match(regExp);
		return match && match[7].length === 11 ? match[7] : null;
	};

	const videoId = getYoutubeId(videoUrl);

	const { mutate: submitVideoCompletion } =
		trpc.student.lesson.submitLessonVideo.useMutation({
			onSuccess: () => {
				setCompleted(true);
				setLoading(false);
				toast.success("Video telah ditandai selesai");
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
		submitVideoCompletion({
			studentId: student.id,
			lessonId: lessonId,
		});
	};

	if (!videoId) return <p className="text-red-500">Invalid YouTube URL</p>;

	return (
		<div className="bg-primary min-h-screen px-4 md:px-11">
			<div className="pt-6 sticky top-0 flex items-center justify-between md:mb-2">
				<Link href="/belajar">
					<Button variant="ghost" className="text-white">
						Keluar
					</Button>
				</Link>
			</div>

			<div className="flex flex-col gap-8 pb-6 mx-auto md:max-w-4xl">
				<div className="flex bg-primary top-0 pt-3 md:pt-0 z-50 flex-col-reverse xl:flex-col">
					<div className="bg-white py-6 xl:pb-0 rounded-xl w-full">
						<div className="flex flex-col items-center p-8">
							{title && (
								<h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>
							)}

							<div className="relative w-full pb-[56.25%] h-0 mb-4">
								<iframe
									className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
									src={`https://www.youtube.com/embed/${videoId}`}
									title="YouTube video player"
									frameBorder="0"
									allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
									allowFullScreen
								/>
							</div>

							{description && (
								<div className="text-lg mt-4 text-center">{description}</div>
							)}
						</div>
						<ShareSection
							url={window?.location?.href ?? ""}
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
							Anda telah menyelesaikan video ini. Silakan lanjutkan ke pelajaran
							berikutnya.
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

export default VideoLesson;
