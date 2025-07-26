import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";

import { Button } from "@/common/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/common/components/ui/dialog";
import StudentBabTable from "@/modules/admin/components/student/StudentBabTable";
import StudentSubBabTable from "@/modules/admin/components/student/StudentSubBabTable";
import useStudentDetail from "@/modules/admin/hooks/useStudentDetail";
import AdminMainLayout from "@/modules/admin/layouts/MainLayout";
import { NextPageWithLayout } from "@/pages/_app";

const StudentDetailPage: NextPageWithLayout = () => {
	const router = useRouter();
	const { student } = useStudentDetail({
		id: router.query.studentId as string,
	});

	const [babId, setBabId] = useState<string | null>(null);
	const [open, setOpen] = useState(false);

	return (
		<>
			<Head>
				<title>Mudah belajar ilmu shorof</title>
			</Head>
			<div>
				<div className="flex items-center justify-between mb-6 relative">
					<Link
						href="/admin/siswa"
						className="left-0 translate-x-[-100%] absolute"
					>
						<Button type="button" size="sm" variant="ghost">
							<ArrowLeftIcon />
						</Button>
					</Link>
					<h1 className="text-3xl font-semibold">Detail Siswa</h1>
				</div>

				<div className="mb-5 flex items-center justify-between gap-x-3 bg-primary py-3 pl-3 pr-6 rounded-lg text-white">
					<div className="flex gap-x-4 items-center">
						<Image
							width={100}
							height={100}
							src={student?.image ?? ""}
							alt={student?.name ?? ""}
							className="rounded-full"
						/>

						<div>
							<div>
								<div className="text-sm">Nama Siswa</div>
								<div className="text-2xl">{student?.name}</div>
							</div>
							<div>
								<div className="text-sm text-white/50">{student?.email}</div>
							</div>
						</div>
					</div>
					<div>
						<div className="text-md font-medium">Total Score</div>
						<div className="text-2xl font-bold text-center">
							{student?.score ?? 0}
						</div>
					</div>
				</div>

				<div className="rounded-md border">
					<StudentBabTable
						onRowClick={(data) => {
							setBabId(data.id);
							setOpen((open) => !open);
						}}
					/>
				</div>

				<DetailBabDialog
					babId={babId}
					open={open}
					setOpen={() => {
						setOpen(false);
						setBabId(null);
					}}
				/>
			</div>
		</>
	);
};

const DetailBabDialog: FC<{
	babId: string | null;
	open: boolean;
	setOpen: (open: boolean) => void;
}> = ({ babId, open, setOpen }) => {
	return (
		<Dialog open={open} onOpenChange={(isOpen) => setOpen(isOpen)}>
			<DialogContent className="max-w-[1000px]">
				<DialogHeader>
					<DialogTitle>Detail Bab</DialogTitle>
					<DialogDescription></DialogDescription>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="rounded-md border">
						<StudentSubBabTable key={babId} babId={babId} />
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

StudentDetailPage.getLayout = (page) => {
	return <AdminMainLayout>{page}</AdminMainLayout>;
};

export default StudentDetailPage;
