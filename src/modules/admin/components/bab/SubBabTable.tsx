import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

import { Button } from "@/common/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/common/components/ui/table";
import SubBabFormDialog from "@/modules/admin/components/sub-bab/FormDialog";
import { trpc } from "@/utils/trpc";

export type Data = {
	id: string;
	number: number;
	name: string | null;
	totalLesson: number;
};

const columnHelper = createColumnHelper<Data>();

export const columns = [
	columnHelper.accessor("number", {
		header: () => <div className="text-center">Nomor</div>,
		cell: (info) => <div className="text-center">{info.getValue()}</div>,
		size: 10,
	}),
	columnHelper.accessor("name", {
		header: "Nama Sub Bab",
		cell: (info) => `${info.getValue() || "{Tanpa sub bab}"}`,
	}),
	columnHelper.accessor("totalLesson", {
		header: () => <div className="text-center">Total Pelajaran</div>,
		size: 40,
		cell: (info) => <div className="text-center">{info.getValue()}</div>,
	}),
];

type SubBabListTableProps = {
	id: string;
};

const SubBabListTable = (props: SubBabListTableProps) => {
	const { id } = props;
	const [subBabDialog, setSubBabDialog] = React.useState({
		open: false,
		mode: "create" as "create" | "update",
	});

	const { data: subBabData, isLoading } = trpc.admin.subBab.list.useQuery({
		babId: id,
		accumulator: "countLesson",
	});

	const subBabListData: Data[] = React.useMemo(() => {
		if (!subBabData?.items) return [];
		return subBabData.items.map((item) => ({
			id: item.id,
			number: item.number,
			name: item.name,
			totalLesson: item._count?.lesson || 0,
		}));
	}, [subBabData?.items]);

	const router = useRouter();
	const table = useReactTable({
		data: subBabListData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<>
			<div className="text-xl mb-4 flex justify-between items-center">
				<h2>List Sub Bab</h2>
				<div className="space-x-2">
					<Link
						href={{
							pathname: "/admin/bab/[babId]/soal",
							query: { babId: id },
						}}
					>
						<Button size="sm" variant="outline">
							Lihat seluruh soal
						</Button>
					</Link>
					<Button
						size="sm"
						onClick={() => {
							setSubBabDialog({ open: true, mode: "create" });
						}}
					>
						Tambah Sub Bab
					</Button>
				</div>
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
												pathname: "/admin/sub-bab/[subBabId]",
												query: { subBabId: row.original.id },
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
									Belum ada data, silahkan tambah data dengan klik tombol
									&quot;Tambah Sub Bab&quot;
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

			<SubBabFormDialog
				mode={subBabDialog.mode}
				open={subBabDialog.open}
				bab={{
					id,
				}}
				setOpen={(open) => {
					setSubBabDialog({ ...subBabDialog, open });
				}}
			/>
		</>
	);
};

export default SubBabListTable;
