import { BookText, FileIcon, PlayCircleIcon, RefreshCcw } from "lucide-react";
import { useRouter } from "next/router";
import type React from "react";
import { toast } from "sonner";
import { cn } from "@/common/utils";
import StarIcon from "../../icons/Star";

type ProgressItemProps = {
	starCount: number;
	href: string;
	style: React.CSSProperties;
	disabled: boolean;
	className: string;
	contentType?: "quiz" | "video" | "pdf" | "mixed";
	isCompleted?: boolean;
};

const getContentTypeIcon = (props: ProgressItemProps) => {
	const { contentType, starCount, disabled, isCompleted = false } = props;

	switch (contentType) {
		case "video":
			return (
				<PlayCircleIcon
					className={cn(
						"transform drop-shadow-lg duration-100 group-hover:scale-y-[.85] size-[25px] scale-y-90",
						{
							"text-white": !isCompleted,
							"text-[#FFBF00]": isCompleted,
						},
					)}
				/>
			);
		case "pdf":
			return (
				<FileIcon
					className={cn(
						"transform drop-shadow-lg duration-100 group-hover:scale-y-[.85] size-[25px] scale-y-90",
						{
							"text-white": !isCompleted,
							"text-[#FFBF00]": isCompleted,
						},
					)}
				/>
			);
		case "mixed":
		case "quiz":
		default: {
			const isShouldPulse = (currentStarNumber: number) => {
				return starCount <= currentStarNumber && !disabled;
			};
			const shouldBounce =
				(isCompleted && starCount > 0) || (starCount <= 0 && !disabled);
			const shouldInfiniteBounce = starCount <= 0 && !disabled;

			return (
				<div className="flex items-center justify-center relative">
					<StarIcon
						className="size-4 mt-1"
						filled={starCount > 0}
						enablePulse={isShouldPulse(1)}
						enableShine={true}
						enableBounce={shouldBounce}
						enableInfiniteBounce={shouldInfiniteBounce}
						animationDelay={100}
					/>
					<StarIcon
						className="size-4 -mt-1.5"
						filled={starCount > 1}
						enablePulse={isShouldPulse(2)}
						enableShine={true}
						enableBounce={shouldBounce}
						enableInfiniteBounce={shouldInfiniteBounce}
						animationDelay={250}
					/>
					<StarIcon
						className="size-4 mt-1"
						filled={starCount > 2}
						enablePulse={isShouldPulse(3)}
						enableShine={true}
						enableBounce={shouldBounce}
						enableInfiniteBounce={shouldInfiniteBounce}
						animationDelay={400}
					/>
				</div>
			);
		}
	}
};

const getContent = (props: ProgressItemProps) => {
	const { disabled, isCompleted, contentType } = props;

	if (contentType === "pdf") {
		return (
			<div className="group mx-auto max-w-64 relative w-full border-2 border-primary rounded-[16px] bg-primary">
				<div className="relative min-h-16 py-3 px-5 flex items-center justify-between gap-x-8 bg-white rounded-[14px] mb-1">
					<div className="text-left font-bold text-neutral-600">
						{isCompleted ? (
							<>Baca Lagi Materi</>
						) : disabled ? (
							<>Terkunci</>
						) : (
							<>
								Baca Materi <br /> Terlebih Dahulu
							</>
						)}
					</div>
					<div className="relative">
						{isCompleted ? (
							<RefreshCcw
								color="#692fce"
								size={36}
								className="opacity-50 group-hover:rotate-180 duration-300 ease-in-out cursor-pointer"
							/>
						) : disabled ? (
							<></>
						) : (
							<>
								<BookText
									color="#692fce"
									size={36}
									className="opacity-80 animate-bounce"
								/>
							</>
						)}
					</div>
				</div>

				{/* Ping animation ring */}
				{!disabled && !isCompleted && (
					<div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping opacity-50 -z-10" />
				)}
			</div>
		);
	}

	return (
		<div
			className={cn(
				"transform duration-100 w-[60px] h-[56px] rounded-[100%] relative",
				{
					"bg-primary-dark1": !disabled,
					"bg-[#828282]": disabled,
				},
			)}
		>
			{/* Ping animation ring */}
			{!disabled && !isCompleted && (
				<div className="absolute inset-0 rounded-full bg-primary/50 animate-ping opacity-50" />
			)}

			<div
				className={cn(
					"w-full transform duration-100 flex items-center justify-center rounded-[100%] h-[48px] bg-primary relative",
					"group-hover:h-[44px]",
					"group-active:h-[50px]",
					{
						"bg-[#c3c3c3]": disabled,
					},
				)}
			>
				{getContentTypeIcon(props)}
			</div>
		</div>
	);
};

const ProgressItem = (props: ProgressItemProps) => {
	const { href, style, disabled, className } = props;

	const router = useRouter();

	return (
		<button
			className={cn("group relative items-center flex flex-col", className, {
				"cursor-pointer": !disabled,
				"cursor-not-allowed": disabled,
			})}
			style={style}
			onClick={() => {
				if (!disabled) {
					router.push(href);
					return;
				}

				// Show toast notification when item is disabled
				toast.warning("Selesaikan pembelajaran sebelumnya untuk membuka ini");
			}}
		>
			{getContent(props)}
		</button>
	);
};

export default ProgressItem;
