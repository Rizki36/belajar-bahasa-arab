import React, { FC } from "react";
import { Spinner } from "@/common/components/ui/spinner";
import useSubBabList from "../../hooks/useSubBab";
import ProgressItem from "./ProgressItem";

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

									// Fixed positioning logic for zigzag pattern
									// For left side items (0, 1, 4, 5, etc.) - increasing from left
									// For right side items (2, 3, 6, 7, etc.) - decreasing from right
									const isLeftSide = Math.floor(index / itemPerSide) % 2 === 0;
									const left = isLeftSide
										? (index % itemPerSide) * spacePerItem
										: (itemPerSide - 1 - (index % itemPerSide)) * spacePerItem;

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
											contentType={item.contentType}
											isCompleted={isCompleted}
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

export default Lessons;
