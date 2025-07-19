import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { toPng } from "html-to-image";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useRef } from "react";
import QRCode from "react-qr-code";
import {
	FacebookIcon,
	FacebookShareButton,
	LinkedinIcon,
	LinkedinShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from "react-share";

import { Button } from "@/common/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/common/components/ui/card";
import { Spinner } from "@/common/components/ui/spinner";
import { generateStudentBabLink } from "@/common/utils";
import DeleteBabButton from "@/modules/admin/components/bab/DeleteButton";
import BabFormDialog from "@/modules/admin/components/bab/FormDialog";
import SubBabListTable from "@/modules/admin/components/bab/SubBabTable";
import AdminMainLayout from "@/modules/admin/layouts/MainLayout";
import { NextPageWithLayout } from "@/pages/_app";
import { trpc } from "@/utils/trpc";

const BabDetailPage: NextPageWithLayout = () => {
	const router = useRouter();
	const [babDialog, setBabDialog] = React.useState({
		open: false,
		mode: "create" as "create" | "update",
	});

	const id = router.query.babId as string;

	const { data: babListResponse, isLoading } = trpc.admin.bab.list.useQuery(
		{
			id,
		},
		{
			enabled: router.isReady,
		},
	);

	const bab = babListResponse?.items?.[0];

	if (isLoading) {
		return (
			<div className="w-full h-screen flex items-center justify-center">
				<Spinner size="large" />
			</div>
		);
	}

	if (!bab) {
		router.replace("/admin/bab");
		return (
			<div className="w-full h-screen flex items-center justify-center"></div>
		);
	}

	return (
		<>
			<Head>
				<title>Mudah belajar ilmu shorof</title>
			</Head>
			<div>
				<div className="flex items-center justify-between mb-8">
					<div className="flex items-center relative">
						<Link
							href="/admin/bab"
							className="left-0 translate-x-[-100%] absolute"
						>
							<Button type="button" size="sm" variant="ghost">
								<ArrowLeftIcon />
							</Button>
						</Link>
						<h1 className="text-3xl font-semibold">Detail Bab</h1>
					</div>
					<div className="space-x-2">
						<Button
							size="sm"
							variant="ghost"
							onClick={() => {
								setBabDialog({ open: true, mode: "update" });
							}}
						>
							Edit
						</Button>
						<DeleteBabButton />
					</div>
				</div>

				<div className="mb-8 flex items-center justify-between">
					<div className="flex gap-x-3">
						<Card className="w-auto">
							<CardHeader className="flex flex-row items-center justify-center space-y-0 pb-2">
								<CardTitle className="text-xs font-medium">Nomor Bab</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-center">
									{bab?.number}
								</div>
							</CardContent>
						</Card>
						<div className="mt-6">
							<div className="text-sm">Nama Bab</div>
							<div className="text-2xl">{bab?.name}</div>
						</div>
					</div>

					<div>
						<QR babNumber={bab.number} />
					</div>
				</div>

				<SubBabListTable id={id} />

				<BabFormDialog
					mode={babDialog.mode}
					open={babDialog.open}
					bab={bab}
					setOpen={(open) => {
						setBabDialog({ ...babDialog, open });
					}}
				/>
			</div>
		</>
	);
};

const QR = ({ babNumber }: { babNumber: number }) => {
	const ref = useRef<HTMLDivElement>(null);

	return (
		<div className="text-center flex flex-col items-center">
			<div className="text-sm mb-2">
				QR Code <br /> menuju bab di siswa
			</div>
			<div ref={ref} className="mb-3 cursor-pointer">
				<QRCode
					size={120}
					value={generateStudentBabLink(babNumber)}
					fgColor="#000"
					onClick={() => {
						if (!ref.current) return;
						toPng(ref.current, { cacheBust: false, quality: 1 })
							.then((dataUrl) => {
								const link = document.createElement("a");
								link.download = `QR Code Bab ${babNumber}.png`;
								link.href = dataUrl;
								link.click();
							})
							.catch((err) => {
								console.log(err);
							});
					}}
				/>
			</div>
			<div className="flex gap-3">
				<WhatsappShareButton url={generateStudentBabLink(babNumber)}>
					<WhatsappIcon
						bgStyle={{
							fill: "#e5e5e5",
						}}
						iconFillColor={"#6c6c6c"}
						size={32}
					/>
				</WhatsappShareButton>
				<LinkedinShareButton url={generateStudentBabLink(babNumber)}>
					<LinkedinIcon
						bgStyle={{
							fill: "#e5e5e5",
						}}
						iconFillColor={"#6c6c6c"}
						size={32}
					/>
				</LinkedinShareButton>
				<FacebookShareButton url={generateStudentBabLink(babNumber)}>
					<FacebookIcon
						bgStyle={{
							fill: "#e5e5e5",
						}}
						iconFillColor={"#6c6c6c"}
						size={32}
					/>
				</FacebookShareButton>
			</div>
		</div>
	);
};

BabDetailPage.getLayout = (page) => {
	return <AdminMainLayout>{page}</AdminMainLayout>;
};

export default BabDetailPage;
