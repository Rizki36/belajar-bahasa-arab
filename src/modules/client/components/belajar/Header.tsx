import { Skeleton } from "@/common/components/ui/skeleton";
import { cn } from "@/common/utils";
import useBab from "../../hooks/useBab";

type HeaderProps = {
	babNumber: number;
};

const Header = (props: HeaderProps) => {
	const { babNumber } = props;
	const { bab, isLoading: loadingBab } = useBab({ babNumber });

	return (
		<div className={cn("top-0 sticky z-10")}>
			<div className={cn("bg-white h-3", "lg:h-6")}></div>
			<div className="bg-[#692fce] mx-4 mb-6 rounded-xl overflow-hidden shadow-lg">
				<div className="flex items-center justify-between mb-2 bg-primary text-left text-white px-4 py-4">
					<div>
						{loadingBab ? (
							<Skeleton className="bg-white/40 h-[20px] lg:h-[28px] w-[150px] lg:w-[250px]" />
						) : (
							<div className={cn("leading-none text-sm", "md:text-lg")}>
								Bab {bab?.number} - {bab?.name}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Header;
