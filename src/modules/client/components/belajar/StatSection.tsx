import { Progress } from "@/common/components/ui/progress";

import useBab from "../../hooks/useBab";
import useProgress from "../../hooks/useProgress";

type StatSectionProps = {
	babNumber: number;
};

const StatSection = (props: StatSectionProps) => {
	const { babNumber } = props;

	const { bab } = useBab({ babNumber });
	const { myLesson, totalLesson, progress } = useProgress({ babId: bab?.id! });

	return (
		<section className="flex flex-col-reverse lg:flex-col mt-3 lg:mt-0 md:mb-0 lg:mb-3 lg:border lg:px-4 rounded-md lg:py-4">
			<div className="hidden lg:block text-base mb-2 font-semibold text-neutral-600">
				Progress belajar
			</div>
			<div>
				<Progress value={progress} />
			</div>
			<div className="text-sm flex items-center justify-between text-neutral-500">
				<span>
					{myLesson} dari {totalLesson} pelajaran
				</span>
				<span>{progress}%</span>
			</div>
		</section>
	);
};

export default StatSection;
