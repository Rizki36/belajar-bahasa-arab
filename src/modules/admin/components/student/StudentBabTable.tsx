import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/router";
import type { FC } from "react";

import { Progress } from "@/common/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/common/components/ui/table";

import useStudentBabList, {
	type StudentBabDataType,
} from "../../hooks/useStudentBabList";

const babColumnHelper = createColumnHelper<StudentBabDataType>();

export const babColumns = [
	babColumnHelper.accessor("number", {
		header: () => <div className="text-center">Nomor Bab</div>,
		cell: (info) => <div className="text-center">{info.getValue()}</div>,
		size: 20,
	}),
	babColumnHelper.accessor("name", {
		header: "Nama Bab",
		size: 50,
		cell: (info) => info.getValue(),
	}),
	babColumnHelper.accessor("score", {
		header: () => <div className="text-center">Score Per Bab</div>,
		size: 30,
		cell: (info) => <div className="text-center">{info.getValue()}</div>,
	}),
	babColumnHelper.accessor("progress", {
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

const StudentBabTable: FC<{
	onRowClick: (data: StudentBabDataType) => void;
}> = ({ onRowClick }) => {
	const router = useRouter();

	const { studentBabList, loadingStudentBabList } = useStudentBabList({
		id: router.query.studentId as string,
	});

	const table = useReactTable({
		data: studentBabList,
		columns: babColumns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<Table>
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
				{!!table.getRowModel().rows?.length && !loadingStudentBabList
					? table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								className="hover:bg-gray-100 cursor-pointer"
								onClick={() => {
									onRowClick(row.original);
								}}
							>
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

				{!table.getRowModel().rows?.length && !loadingStudentBabList ? (
					<TableRow>
						<TableCell colSpan={babColumns.length} className="h-24 text-center">
							Belum ada data
						</TableCell>
					</TableRow>
				) : null}

				{loadingStudentBabList ? (
					<TableRow>
						<TableCell colSpan={babColumns.length} className="h-24 text-center">
							Memuat data...
						</TableCell>
					</TableRow>
				) : null}
			</TableBody>
		</Table>
	);
};

export default StudentBabTable;
