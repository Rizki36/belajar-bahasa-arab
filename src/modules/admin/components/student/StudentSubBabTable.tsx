import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import React, { FC } from "react";

import { Progress } from "@/common/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/common/components/ui/table";

import useStudentSubBabList, {
	StudentSubBabDataType,
} from "../../hooks/useStudentSubBabList";

const subBabColumnHelper = createColumnHelper<StudentSubBabDataType>();

const subBabColumns = [
	subBabColumnHelper.accessor("number", {
		header: () => <div className="text-center">Nomor</div>,
		cell: (info) => <div className="text-center">{info.getValue()}</div>,
		size: 20,
	}),
	subBabColumnHelper.accessor("name", {
		header: "Nama Sub Bab",
		size: 45,
		cell: (info) => `${info.getValue() || "{Tanpa sub bab}"}`,
	}),
	subBabColumnHelper.accessor("score", {
		header: () => <div className="text-center">Score Per Sub Bab</div>,
		size: 35,
		cell: (info) => <div className="text-center">{info.getValue()}</div>,
	}),
	subBabColumnHelper.accessor("progress", {
		header: () => <div className="text-center">Progress Belajar</div>,
		size: 100,
		cell: (info) => (
			<div className="flex items-center gap-x-2">
				<span className="text-xs text-muted-foreground">
					{info.getValue()}/{info.row.original.maxProgress}
				</span>
				<Progress
					value={(info.getValue() / info.row.original.maxProgress) * 100}
				/>
			</div>
		),
	}),
];

const StudentSubBabTable: FC<{
	babId: string | null;
}> = ({ babId }) => {
	const router = useRouter();

	const { studentSubBabList, loadingStudentSubBabList } = useStudentSubBabList({
		babId: babId!,
		studentId: router.query.studentId as string,
	});

	const table = useReactTable({
		data: studentSubBabList,
		columns: subBabColumns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
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
				{!!table.getRowModel().rows?.length && !loadingStudentSubBabList
					? table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell
										key={cell.id}
										style={{ width: `${cell.column.getSize()}px` }}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))
					: null}

				{!table.getRowModel().rows?.length && !loadingStudentSubBabList ? (
					<TableRow>
						<TableCell
							colSpan={subBabColumns.length}
							className="h-24 text-center"
						>
							Belum ada data
						</TableCell>
					</TableRow>
				) : null}

				{loadingStudentSubBabList ? (
					<TableRow>
						<TableCell
							colSpan={subBabColumns.length}
							className="h-24 text-center"
						>
							Memuat data...
						</TableCell>
					</TableRow>
				) : null}
			</TableBody>
		</Table>
	);
};

export default StudentSubBabTable;
