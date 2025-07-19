import { useRouter } from "next/router";
import React, { FC, useMemo } from "react";

import { Spinner } from "@/common/components/ui/spinner";
import { cn } from "@/common/utils";

import useSubBabList from "../../hooks/useSubBab";
import StarIcon from "../../icons/Star";

type LessonsProps = {
	babNumber: number;
};

const Lessons: FC<LessonsProps> = ({ babNumber }) => {
	const { subBabList, loadingSubBabList } = useSubBabList({ babNumber });

	return (
		<>
			{loadingSubBabList ? (
				<div>
					<Spinner />
				</div>
			) : (
				<>
					{subBabList.map((subBab, subBabIndex) => {
						let previousLessonCompleted =
							subBabIndex === 0
								? true
								: // Check if last lesson of previous subBab was completed
									subBabList[subBabIndex - 1]?.lesson.slice(-1)[0]
										?.studentLessonResult?.[0] !== undefined;

						return (
							<section
								id={subBab.id}
								key={subBab.id}
								className="w-full px-10 flex flex-col items-center pb-6"
							>
								{subBabIndex !== 0 ? (
									<div className="flex w-full items-center my-8">
										<hr className="flex-1 leading-[24px]" />
										<h1 className="leading-[24px] mx-3 text-neutral-500">
											{subBab?.name}
										</h1>
										<hr className="flex-1 leading-[24px]" />
									</div>
								) : null}

								{subBab.lesson.map((item, index) => {
									const itemPerSide = 2;
									const spacePerItem = 40;
									const left =
										index % (itemPerSide * 2) < itemPerSide
											? (index % itemPerSide) * spacePerItem
											: (itemPerSide - (index % itemPerSide)) * spacePerItem;

									const lessonResult = item?.studentLessonResult?.[0];
									const isCompleted = !!lessonResult;

									// Determine if this lesson should be enabled
									const isEnabled =
										index === 0
											? previousLessonCompleted
											: !!subBab.lesson[index - 1]?.studentLessonResult?.[0];

									// Update for next lesson in this subBab
									if (isCompleted) {
										previousLessonCompleted = true;
									}

									return (
										<ProgressItem
											key={item.id}
											className="last:!mb-0"
											href={`/belajar/${babNumber}/${subBab.number}/${item.number}`}
											starCount={lessonResult?.star ?? 0}
											style={{
												marginBottom: "30px",
												left: `${left}px`,
											}}
											disabled={!isEnabled}
										/>
									);
								})}
							</section>
						);
					})}
				</>
			)}
		</>
	);
};

const ProgressItem = ({
	starCount,
	href,
	style,
	disabled,
	className,
}: {
	starCount: number;
	href: string;
	style: React.CSSProperties;
	disabled: boolean;
	className: string;
}) => {
	const router = useRouter();

	return (
		<button
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
						"w-full transform duration-100 flex items-center justify-center rounded-[100%] h-[48px] bg-primary",
						"group-hover:h-[44px]",
						"group-active:h-[50px]",
						{
							"bg-[#e0e0e0]": disabled,
						},
					)}
				>
					<StarIcon
						className="transform drop-shadow-lg duration-100 group-hover:scale-y-[.85] size-[25px] scale-y-90"
						filled={starCount > 0}
					/>
				</div>
			</div>
			<div className="flex items-center gap-x-2 -mb-1">
				<StarIcon className="size-[25px] -mt-3.5" filled={starCount > 0} />
				<StarIcon className="size-[25px] mt-0.5" filled={starCount > 1} />
				<StarIcon className="size-[25px] -mt-3.5" filled={starCount > 2} />
			</div>
		</button>
	);
};

export default Lessons;
