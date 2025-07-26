import { cva, type VariantProps } from "class-variance-authority";
import QRCode from "react-qr-code";
import {
	FacebookIcon,
	FacebookShareButton,
	LinkedinIcon,
	LinkedinShareButton,
	WhatsappIcon,
	WhatsappShareButton,
} from "react-share";

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/common/components/ui/popover";
import { cn } from "@/common/utils";

const ShareSectionVariants = cva("flex mb-3 gap-3 px-4 rounded-md py-4", {
	variants: {
		variant: {
			default: "border",
			ghost: "",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

type ShareSectionVariantsProps = VariantProps<typeof ShareSectionVariants>;

type Variant = NonNullable<ShareSectionVariantsProps["variant"]>;
type ShareSectionProps = {
	url: string;
	className?: string;
	variant?: Variant;
};

const bgFill: Record<Variant, string> = {
	default: "#e5e5e5",
	ghost: "#fff",
};
const iconFillColor: Record<Variant, string> = {
	default: "#6c6c6c",
	ghost: "#d7d7d7",
};

const ShareSection = (props: ShareSectionProps) => {
	const { className, variant = "default", url } = props;

	return (
		<section
			className={cn(
				ShareSectionVariants({
					variant,
					className,
				}),
			)}
		>
			<Popover>
				<PopoverTrigger>
					<QRCode size={60} value={url} fgColor={iconFillColor[variant]} />
				</PopoverTrigger>
				<PopoverContent className="w-auto" align="center">
					<QRCode size={100} value={url} fgColor="#000" />
				</PopoverContent>
			</Popover>

			<div>
				<div
					className={cn("mb-2 leading-none", {
						"text-neutral-300": variant === "ghost",
						"text-neutral-700": variant === "default",
					})}
				>
					Bagikan
				</div>
				<div className="flex gap-3">
					<WhatsappShareButton url={url}>
						<WhatsappIcon
							bgStyle={{
								fill: bgFill[variant],
							}}
							iconFillColor={iconFillColor[variant]}
							size={32}
							round
						/>
					</WhatsappShareButton>
					<LinkedinShareButton url={url}>
						<LinkedinIcon
							bgStyle={{
								fill: bgFill[variant],
							}}
							iconFillColor={iconFillColor[variant]}
							size={32}
							round
						/>
					</LinkedinShareButton>
					<FacebookShareButton url={url}>
						<FacebookIcon
							bgStyle={{
								fill: bgFill[variant],
							}}
							iconFillColor={iconFillColor[variant]}
							size={32}
							round
						/>
					</FacebookShareButton>
				</div>
			</div>
		</section>
	);
};

export default ShareSection;
