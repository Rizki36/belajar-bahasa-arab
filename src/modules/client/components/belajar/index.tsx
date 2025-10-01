import { cn } from "@/common/utils";
import Header from "./Header";
import Lessons from "./Lessons";
import ProfileSection from "./ProfileSection";
import ShareSection from "./ShareSection";
import StatSection from "./StatSection";

type BabProps = {
	babNumber: number;
};

const Bab = (props: BabProps) => {
	const { babNumber } = props;

	return (
		<section className="min-h-svh flex flex-col-reverse lg:flex-row">
			<div
				className={cn(
					"flex-1 relative flex flex-col",
					"lg:py-4 lg:mx-8 xl:mx-12",
				)}
			>
				<Header babNumber={babNumber} />
				<Lessons babNumber={babNumber} />
			</div>
			<div
				className={cn(
					"flex",
					"relative flex-col lg:w-[330px] pl-4 pb-0 pt-4 pr-4 lg:pr-6 lg:pl-0 lg:pb-6",
				)}
			>
				<div className="h-6 hidden lg:block"></div>
				<div className="flex sticky h-svh top-0 flex-col flex-1">
					<div className="lg:mb-6">
						<ProfileSection />
					</div>
					<div className=" lg:block">
						<StatSection babNumber={babNumber} />
					</div>
					<div className="hidden lg:block">
						<ShareSection url={window?.location?.href ?? ""} />
					</div>
					<div
						data-tut="reactour__credits"
						className="text-xs text-neutral-500 hidden lg:block"
					>
						<div>Disusun oleh:</div>
						<div>Abdul Ghofur, S.Pd.I., M.Pd.</div>
						<div>Siti Durotun Naseha, M.Pd</div>
						<div>Sri Widoyoningrum, ST., M.Pd</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Bab;
