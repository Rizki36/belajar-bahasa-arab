import type React from "react";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

interface GoogleDrivePdfViewerProps {
	pdfUrl: string;
	className?: string;
	title?: string;
	minHeight?: string;
	allowedFeatures?: string;
}

const GoogleDrivePdfViewer: React.FC<GoogleDrivePdfViewerProps> = ({
	pdfUrl,
	className = "w-full min-h-[400px] md:min-h-[500px]",
	title = "PDF Preview",
	minHeight,
	allowedFeatures = "autoplay; encrypted-media;",
}) => {
	const [isLoading, setIsLoading] = useState(true);

	// Convert Google Drive URL to embeddable format
	const getEmbedUrl = (url: string) => {
		if (url.includes("drive.google.com/file/d/")) {
			const fileIdMatch = url.match(/\/file\/d\/([^/]+)/);
			if (fileIdMatch && fileIdMatch[1]) {
				return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
			}
		}
		return url;
	};

	const embedUrl = getEmbedUrl(pdfUrl);
	const iframeClassName = minHeight ? `w-full ${minHeight}` : className;

	return (
		<div className="w-full h-full border rounded-lg p-4 bg-white shadow relative">
			{isLoading && (
				<div className="absolute inset-0 flex justify-center items-center z-10">
					<Spinner size="large" />
				</div>
			)}
			<iframe
				src={embedUrl}
				className={iframeClassName}
				onLoad={() => setIsLoading(false)}
				allow={allowedFeatures}
				style={{ border: 0 }}
				title={title}
			/>
		</div>
	);
};

export default GoogleDrivePdfViewer;
