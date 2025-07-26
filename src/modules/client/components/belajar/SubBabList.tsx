import { Spinner } from "@/common/components/ui/spinner";
import { cn } from "@/common/utils";
import useActiveSubBab from "../../hooks/useActiveSubBab";
import useSubBabList from "../../hooks/useSubBab";

type SubBabListProps = {
	babNumber: number;
};

const SubBabList = (props: SubBabListProps) => {
	const { babNumber } = props;
	const { subBabList, loadingSubBabList } = useSubBabList({ babNumber });
	const { activeSubBab } = useActiveSubBab(subBabList);

	// Scroll to sub bab on click
	const scrollToSubBab = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	if (loadingSubBabList) {
		return (
			<div className="flex justify-center">
				<Spinner />
			</div>
		);
	}

	return (
		<div className="mb-6 px-4">
			<div className="flex no-scrollbar overflow-auto">
				{subBabList.map((subBab, index) => {
					return (
						<button
							onClick={() => scrollToSubBab(subBab.id)}
							key={subBab.id}
							className={cn(
								"mx-1 px-3 py-1 min-w-max text-sm md:text-md rounded-md",
								activeSubBab?.id === subBab.id
									? "bg-primary/95 text-white"
									: "bg-gray-100 text-gray-500",
							)}
						>
							{subBab.name}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default SubBabList;
