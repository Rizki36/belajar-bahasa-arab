import type React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/common/components/ui/button";
import { Spinner } from "@/common/components/ui/spinner";

// Set the worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

type PDFComponentsProps = {
	pdfUrl: string;
	pageNumber: number;
	onDocumentLoadSuccess: ({ numPages }: { numPages: number }) => void;
	isDesktop: boolean;
	pdfLoading: boolean;
	numPages: number | null;
	setPageNumber: React.Dispatch<React.SetStateAction<number>>;
};

const PDFComponents = (props: PDFComponentsProps) => {
	const {
		pdfUrl,
		pageNumber,
		onDocumentLoadSuccess,
		isDesktop,
		pdfLoading,
		numPages,
		setPageNumber,
	} = props;

	return (
		<>
			<Document
				file={pdfUrl}
				onLoadSuccess={onDocumentLoadSuccess}
				loading={
					<div className="flex justify-center p-8 min-h-[400px] items-center">
						<Spinner size="large" />
					</div>
				}
				error={
					<div className="text-center text-red-500 p-4">
						Error loading PDF. Please try again later.
					</div>
				}
			>
				<Page
					pageNumber={pageNumber}
					width={isDesktop ? 600 : 300}
					renderTextLayer={false}
					renderAnnotationLayer={false}
				/>
			</Document>

			{!pdfLoading && (
				<div className="flex justify-between items-center mt-4">
					<Button
						onClick={() => setPageNumber(pageNumber - 1)}
						disabled={pageNumber <= 1}
						variant="outline"
					>
						Previous
					</Button>
					<p className="text-center">
						Page {pageNumber} of {numPages}
					</p>
					<Button
						onClick={() => setPageNumber(pageNumber + 1)}
						disabled={pageNumber >= (numPages || 0)}
						variant="outline"
					>
						Next
					</Button>
				</div>
			)}
		</>
	);
};

export default PDFComponents;
