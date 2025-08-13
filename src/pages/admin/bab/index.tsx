import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import Head from "next/head";
import { useRouter } from "next/router";
import * as React from "react";

import { Button } from "@/common/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/common/components/ui/table";
import BabFormDialog from "@/modules/admin/components/bab/FormDialog";
import AdminMainLayout from "@/modules/admin/layouts/MainLayout";
import type { NextPageWithLayout } from "@/pages/_app";
import { trpc } from "@/utils/trpc";

export type Data = {
	id: string;
	number: number;
	name: string;
	totalSubBab: number;
};

const columnHelper = createColumnHelper<Data>();

export const columns = [
	columnHelper.accessor("number", {
		header: () => <div className="text-center">Nomor</div>,
		cell: (info) => <div className="text-center">{info.getValue()}</div>,
		size: 10,
	}),
	columnHelper.accessor("name", {
		header: "Nama bab",
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("totalSubBab", {
		header: () => <div className="text-center">Total Sub Bab</div>,
		size: 30,
		cell: (info) => <div className="text-center">{info.getValue()}</div>,
	}),
];

const BabPage: NextPageWithLayout = () => {
	const [openBabDialog, setBabDialog] = React.useState({
		open: false,
		mode: "create" as "create" | "update",
	});

	const { data: babListResponse, isLoading } = trpc.admin.bab.list.useQuery({
		accumulator: "countSubBab",
	});

	const babTableData: Data[] = React.useMemo(() => {
		if (!babListResponse?.items) return [];
		return babListResponse.items.map((item) => ({
			id: item.id,
			number: item.number,
			name: item.name,
			totalSubBab: item._count?.subBab || 0,
		}));
	}, [babListResponse?.items]);

	const router = useRouter();
	const table = useReactTable({
		data: babTableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<>
			<Head>
				<title>Mudah belajar ilmu shorof</title>
			</Head>
			<div className="w-full">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-3xl font-semibold">Bab</h1>
					<Button
						size="sm"
						onClick={() => {
							setBabDialog({ mode: "create", open: true });
						}}
					>
						Tambah bab
					</Button>
				</div>

				<div>
					<Table className="table-fixed">
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead
												key={header.id}
												style={{ width: `${header.getSize()}px` }}
											>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{!!table.getRowModel().rows?.length && !isLoading
								? table.getRowModel().rows.map((row) => (
										<TableRow
											key={row.id}
											className="cursor-pointer"
											onClick={() => {
												router.push({
													pathname: "/admin/bab/[babId]",
													query: { babId: row.original.id },
												});
											}}
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell
													key={cell.id}
													style={{ width: `${cell.column.getSize()}px` }}
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext(),
													)}
												</TableCell>
											))}
										</TableRow>
									))
								: null}

							{!table.getRowModel().rows?.length && !isLoading ? (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										Belum ada data, silahkan klik tombol &quot;Tambah bab&quot;
										untuk menambah data
									</TableCell>
								</TableRow>
							) : null}

							{isLoading ? (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										Memuat data...
									</TableCell>
								</TableRow>
							) : null}
						</TableBody>
					</Table>
				</div>

				<BabFormDialog
					mode={openBabDialog.mode}
					open={openBabDialog.open}
					setOpen={(open) => {
						setBabDialog({ ...openBabDialog, open });
					}}
				/>
			</div>
		</>
	);
};

BabPage.getLayout = (page) => {
	return <AdminMainLayout>{page}</AdminMainLayout>;
};

export default BabPage;
