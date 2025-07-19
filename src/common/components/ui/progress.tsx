import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cva, VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/common/utils";

const progressVariants = cva(
	"relative h-2 w-full overflow-hidden rounded-full",
	{
		variants: {
			variant: {
				default: "bg-primary/20",
				white: "bg-white/20",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const indicatorVariants = cva(
	"h-full w-full flex-1 bg-primary transition-all",
	{
		variants: {
			variant: {
				default: "bg-primary",
				white: "bg-white",
			},
		},
	},
);

type ProgressProps = React.ComponentPropsWithoutRef<
	typeof ProgressPrimitive.Root
> & {
	variant?: VariantProps<typeof progressVariants>["variant"];
};

const Progress = React.forwardRef<
	React.ElementRef<typeof ProgressPrimitive.Root>,
	ProgressProps
>(({ className, value, variant = "default", ...props }, ref) => (
	<ProgressPrimitive.Root
		ref={ref}
		className={cn(progressVariants({ variant, className }))}
		{...props}
	>
		<ProgressPrimitive.Indicator
			className={cn(indicatorVariants({ variant }))}
			style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
		/>
	</ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
