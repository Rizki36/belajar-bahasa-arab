import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import Head from "next/head";
import { useRouter } from "next/router";
import { toast } from "sonner";

import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/common/components/ui/pagination";
import { Progress } from "@/common/components/ui/progress";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/common/components/ui/table";
import usePagination from "@/modules/admin/hooks/usePagination";
import useStudentList, {
	type StudentDataType,
} from "@/modules/admin/hooks/useStudentList";
import AdminMainLayout from "@/modules/admin/layouts/MainLayout";
import type { NextPageWithLayout } from "@/pages/_app";

const columnHelper = createColumnHelper<StudentDataType>();

export const columns = [
	columnHelper.display({
		id: "number",
		header: () => <div className="text-center">Nomor</div>,
		cell: (info) => (
			<div className="text-center">
				{info.table.getState().pagination.pageIndex *
					info.table.getState().pagination.pageSize +
					info.row.index +
					1}
			</div>
		),
		size: 20,
	}),
	columnHelper.accessor("name", {
		header: "Nama Siswa",
		size: 50,
		cell: (info) => info.getValue(),
	}),
	columnHelper.accessor("score", {
		header: () => <div className="text-center">Nilai</div>,
		size: 30,
		cell: (info) => <div className="text-center">{info.getValue()}</div>,
	}),
	columnHelper.display({
		id: "progress",
		header: () => <div className="text-center">Progress Belajar</div>,
		size: 100,
		cell: (info) => (
			<div className="flex items-center gap-x-2">
				<span className="text-xs text-muted-foreground">
					{info.row.original.myLesson}/{info.row.original.totalLesson}
				</span>
				<Progress
					value={
						(info.row.original.myLesson / info.row.original.totalLesson) * 100
					}
				/>
			</div>
		),
	}),
];

const StudentPage: NextPageWithLayout = () => {
	const { limit, onPaginationChange, skip, pagination } = usePagination();

	const { loadingStudentList, studentList } = useStudentList({
		skip,
		limit: limit + 1,
	});

	const data = studentList.slice(0, limit);
	const hasNextPage = studentList.length > limit;

	const router = useRouter();

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		onPaginationChange,
		state: { pagination },
	});

	return (
		<>
			<Head>
				<title>Mudah belajar ilmu shorof</title>
			</Head>
			<div className="w-full">
				<div className="flex items-center justify-between mb-6">
					<h1 className="text-3xl font-semibold">List Siswa</h1>
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
							{!!table.getRowModel().rows?.length && !loadingStudentList
								? table.getRowModel().rows.map((row) => (
										<TableRow
											key={row.id}
											className="cursor-pointer"
											onClick={() => {
												router.push({
													pathname: "/admin/siswa/[studentId]",
													query: { studentId: row.original.id },
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

							{!table.getRowModel().rows?.length && !loadingStudentList ? (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										Belum ada data
									</TableCell>
								</TableRow>
							) : null}

							{loadingStudentList ? (
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

					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									href=""
									onClick={(e) => {
										e.preventDefault();
										if (table.getState().pagination.pageIndex === 0) {
											toast.warning("Tidak ada halaman sebelumnya");
											return;
										}
										table.setPageIndex(
											table.getState().pagination.pageIndex - 1,
										);
									}}
								/>
							</PaginationItem>
							<PaginationItem>
								<PaginationLink
									href=""
									onClick={(e) => {
										e.preventDefault();
									}}
								>
									{table.getState().pagination.pageIndex + 1}
								</PaginationLink>
							</PaginationItem>
							<PaginationItem>
								<PaginationNext
									href=""
									onClick={(e) => {
										e.preventDefault();
										if (!hasNextPage) {
											toast.warning("Tidak ada halaman selanjutnya");
											return;
										}
										table.setPageIndex(
											table.getState().pagination.pageIndex + 1,
										);
									}}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			</div>
		</>
	);
};

StudentPage.getLayout = (page) => {
	return <AdminMainLayout>{page}</AdminMainLayout>;
};

export default StudentPage;
