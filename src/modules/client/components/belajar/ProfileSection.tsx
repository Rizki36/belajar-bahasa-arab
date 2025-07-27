import Image from "next/image";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/common/components/ui/skeleton";
import ScoreIcon from "@/common/icons/Score";
import useStudent from "../../hooks/useStudent";

type ProfileSectionProps = {};

const ProfileSection = (props: ProfileSectionProps) => {
	const {} = props;

	const { data, status } = useSession();
	const { student, loadingStudent } = useStudent();

	return (
		<div className="flex items-center justify-between text-neutral-500">
			<div className="flex gap-2 items-center">
				{status === "loading" ? (
					<>
						<Skeleton className="size-9 rounded-full" />
						<Skeleton className="h-6 w-[160px]" />
					</>
				) : (
					<>
						<Image
							alt="profile"
							src={data?.user?.image ?? ""}
							width={36}
							height={36}
							className="size-9 rounded-full bg-neutral-300"
						/>
						<span>{data?.user?.name ?? "-"}</span>
					</>
				)}
			</div>

			<div className="flex items-center gap-2 leading-none">
				{loadingStudent ? (
					<Skeleton className="w-7 h-6" />
				) : (
					<>
						<span>{student?.score ?? 0}</span>
						<ScoreIcon className="size-6" />
					</>
				)}
			</div>
		</div>
	);
};

export default ProfileSection;
