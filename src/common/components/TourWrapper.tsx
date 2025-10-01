import {
	type ProviderProps,
	type StepType,
	TourProvider,
} from "@reactour/tour";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import type React from "react";
import { useTourGuide } from "@/common/hooks/useTourGuide";
import { Button } from "./ui/button";

type TourWrapperProps = {
	children: React.ReactNode;
	steps?: StepType[];
	className?: string;
	pageId?: string;
};

const tourStyles: ProviderProps["styles"] = {
	close: (base) => ({
		...base,
		top: 10,
		right: 10,
		color: "#7C39ED",
		fontSize: "20px",
	}),
	badge: (base) => ({
		...base,
		background: "#7C39ED",
		color: "white",
		fontWeight: "bold",
	}),
	// @ts-ignore
	dot: (base, { current }) => ({
		...base,
		background: current ? "#7C39ED" : "#ccc",
		width: "12px",
		height: "12px",
	}),
	popover: (base) => ({
		...base,
		background: "white",
		borderRadius: 12,
		boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
		border: "2px solid #7C39ED",
		padding: "20px",
		maxWidth: "320px",
	}),
	navigation: (base) => ({
		...base,
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		marginTop: "15px",
		gap: "10px",
	}),
};

/**
 * TourWrapper component for wrapping pages with tour functionality
 *
 * Usage:
 * 1. Import this component in the page where you want to add a tour
 * 2. Wrap page content with TourWrapper
 * 3. Define steps according to your needs
 * 4. Add data-tut attribute to elements you want to highlight
 *
 * Example:
 * ```tsx
 * const steps = [
 *   {
 *     selector: '[data-tut="feature-1"]',
 *     content: <div>Feature 1 explanation</div>
 *   }
 * ];
 *
 * <TourWrapper steps={steps}>
 *   <div data-tut="feature-1">Feature 1</div>
 * </TourWrapper>
 * ```
 */
const TourWrapper: React.FC<TourWrapperProps> = ({
	children,
	steps = [],
	className = "tour-wrapper",
	pageId = "default",
}) => {
	const { markTourAsCompleted } = useTourGuide(pageId);

	const handleTourClose = () => {
		markTourAsCompleted();
	};
	const disableBody = (target: Element | HTMLElement) =>
		disableBodyScroll(target);
	const enableBody = (target: Element | HTMLElement) =>
		enableBodyScroll(target);

	return (
		<TourProvider
			styles={tourStyles}
			steps={steps}
			onClickClose={handleTourClose}
			showNavigation={true}
			showBadge={true}
			showCloseButton={true}
			disableDotsNavigation={false}
			disableKeyboardNavigation={false}
			className={className}
			afterOpen={(element) => {
				disableBody(element!);
			}}
			beforeClose={(element) => {
				markTourAsCompleted();
				enableBody(element!);
				return Promise.resolve();
			}}
			position="bottom"
			nextButton={({
				currentStep,
				stepsLength,
				Button: DefaultButton,
				setIsOpen,
			}) =>
				stepsLength - 1 === currentStep ? (
					<Button variant="default" onClick={() => setIsOpen(false)}>
						Selesai
					</Button>
				) : (
					<DefaultButton />
				)
			}
			onClickMask={() => null}
		>
			{children}
		</TourProvider>
	);
};

export default TourWrapper;
