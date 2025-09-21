import { FileIcon, PlayCircleIcon } from "lucide-react";
import { useRouter } from "next/router";
import type React from "react";
import { cn } from "@/common/utils";
import StarIcon from "../../icons/Star";

type ProgressItemProps = {
	id?: string;
	starCount: number;
	href: string;
	style: React.CSSProperties;
	disabled: boolean;
	className: string;
	contentType?: "quiz" | "video" | "pdf" | "mixed";
	isCompleted?: boolean;
};

const ProgressItem = (props: ProgressItemProps) => {
	const {
		id,
		starCount,
		href,
		style,
		disabled,
		className,
		contentType = "quiz",
		isCompleted,
	} = props;

	const router = useRouter();

	const ContentTypeIcon = () => {
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
			default:
				return (
					<div className="flex items-center justify-center">
						<StarIcon className="size-4 mt-1" filled={starCount > 0} />
						<StarIcon className="size-4 -mt-1.5" filled={starCount > 1} />
						<StarIcon className="size-4 mt-1" filled={starCount > 2} />
					</div>
				);
		}
	};

	return (
		<button
			id={id}
			className={cn("group relative items-center flex flex-col", className, {
				"cursor-pointer": !disabled,
				"cursor-not-allowed": disabled,
			})}
			style={style}
			disabled={disabled}
			onClick={() => {
				if (!disabled) {
					router.push(href);
				}
			}}
		>
			<div
				className={cn(
					"transform duration-100 w-[60px] h-[56px] rounded-[100%]",
					{
						"bg-primary-dark1": !disabled,
						"bg-[#cbcbcb]": disabled,
					},
				)}
			>
				<div
					className={cn(
						"w-full transform duration-100 flex items-center justify-center rounded-[100%] h-[48px] bg-primary relative",
						"group-hover:h-[44px]",
						"group-active:h-[50px]",
						{
							"bg-[#e0e0e0]": disabled,
						},
					)}
				>
					<ContentTypeIcon />
				</div>
			</div>
		</button>
	);
};

export default ProgressItem;
