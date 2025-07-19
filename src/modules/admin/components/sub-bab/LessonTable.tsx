import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
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
import LessonFormDialog from "@/modules/admin/components/lesson/FormDialog";
import { trpc } from "@/utils/trpc";

export type Data = {
	id: string;
	number: number;
	totalLesson: number;
};

const columnHelper = createColumnHelper<Data>();

export const columns = [
	columnHelper.accessor("number", {
		header: () => <div className="text-center">Nomor Pelajaran</div>,
		cell: (info) => <div className="text-center">{info.getValue()}</div>,
		size: 30,
	}),
	columnHelper.accessor("totalLesson", {
		header: () => <div className="text-center">Total Soal</div>,
		cell: (info) => <div className="text-center">{info.getValue()}</div>,
	}),
];

const LessonTable: React.FC<{
	babId: string;
	subBabId: string;
}> = ({ babId, subBabId }) => {
	const [lessonDialog, setLessonDialog] = React.useState({
		open: false,
		mode: "create" as "create" | "update",
	});

	const { data: lessonData, isLoading } = trpc.admin.lesson.list.useQuery({
		subBabId,
		accumulator: "countQuestion",
	});
	const lessonListTableData: Data[] = React.useMemo(() => {
		if (!lessonData?.items) return [];
		return lessonData.items.map((item) => ({
			id: item.id,
			number: item.number,
			totalLesson: item._count?.question || 0,
		}));
	}, [lessonData?.items]);

	const router = useRouter();
	const table = useReactTable({
		data: lessonListTableData,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

	return (
		<>
			<div className="text-xl mb-4 flex justify-between items-center">
				<h2>List Pelajaran</h2>
				<div>
					<Button
						size="sm"
						onClick={() => {
							setLessonDialog({ mode: "create", open: true });
						}}
					>
						Tambah Pelajaran
					</Button>
				</div>
			</div>

			<div className="rounded-md border">
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
												pathname: "/admin/lesson/[lessonId]",
												query: { lessonId: row.original.id },
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
									Belum ada data, silahkan tambah data
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
			<LessonFormDialog
				mode={lessonDialog.mode}
				open={lessonDialog.open}
				bab={{
					id: babId,
				}}
				subBab={{
					id: subBabId,
				}}
				setOpen={(open) => {
					setLessonDialog({ ...lessonDialog, open });
				}}
			/>
		</>
	);
};

export default LessonTable;
