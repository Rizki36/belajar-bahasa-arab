import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type React from "react";

import { cn } from "@/common/utils";

const spinnerVariants = cva("flex-col items-center justify-center", {
	variants: {
		show: {
			true: "flex",
			false: "hidden",
		},
	},
	defaultVariants: {
		show: true,
	},
});

const loaderVariants = cva("animate-spin text-primary", {
	variants: {
		size: {
			small: "size-6",
			medium: "size-8",
			large: "size-12",
		},
	},
	defaultVariants: {
		size: "medium",
	},
});

type SpinnerProps = VariantProps<typeof spinnerVariants> &
	VariantProps<typeof loaderVariants> & {
		className?: string;
		children?: React.ReactNode;
	};

export function Spinner(props: SpinnerProps) {
	const { size, show, children, className } = props;

	return (
		<span className={spinnerVariants({ show })}>
			<Loader2 className={cn(loaderVariants({ size }), className)} />
			{children}
		</span>
	);
}
