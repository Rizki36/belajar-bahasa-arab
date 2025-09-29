import { cn } from "@/common/utils";

const StarIcon = ({
	filled,
	animationDelay = 0,
	enablePulse = false,
	enableShine = false,
	enableBounce = false,
	enableInfiniteBounce = false,
	...props
}: React.JSX.IntrinsicElements["svg"] & {
	filled?: boolean;
	animationDelay?: number;
	enablePulse?: boolean;
	enableShine?: boolean;
	enableBounce?: boolean;
	enableInfiniteBounce?: boolean;
}) => {
	return (
		<div
			className={cn("transition-all duration-300 ease-out", {
				"animate-bounce": enableBounce,
			})}
			style={{
				animationDuration: enableBounce ? "0.6s" : undefined,
				animationDelay: enableBounce ? `${animationDelay}ms` : undefined,
				animationIterationCount: enableBounce
					? enableInfiniteBounce
						? "infinite"
						: "1"
					: undefined,
			}}
		>
			<svg
				width="46"
				height="44"
				viewBox="0 0 46 44"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				className={cn("transition-all duration-300 ease-out", {
					"drop-shadow-lg": filled,
					"hover:scale-110": filled,
					"transform-gpu": true,
				})}
				{...props}
			>
				{filled ? (
					<>
						<path
							d="M20.3146 1.51531L14.7596 12.7785L2.33094 14.5905C0.102124 14.9138 -0.791105 17.6615 0.825214 19.2353L9.81705 27.9974L7.69032 40.375C7.30751 42.6124 9.66393 44.2882 11.6375 43.2419L22.7561 37.3976L33.8747 43.2419C35.8483 44.2797 38.2047 42.6124 37.8219 40.375L35.6952 27.9974L44.687 19.2353C46.3033 17.6615 45.4101 14.9138 43.1813 14.5905L30.7526 12.7785L25.1976 1.51531C24.2023 -0.492324 21.3184 -0.517845 20.3146 1.51531Z"
							fill="url(#paint0_linear_174_293)"
						/>
						<defs>
							<linearGradient
								id="paint0_linear_174_293"
								x1="22.7561"
								y1="0"
								x2="22.7561"
								y2="43.5609"
								gradientUnits="userSpaceOnUse"
							>
								<stop stopColor="#ECFF34" />
								<stop offset="0.5" stopColor="#FFD700" />
								<stop offset="1" stopColor="#FFB619" />
							</linearGradient>
						</defs>
					</>
				) : (
					<>
						<mask id="path-1-inside-1_174_294" fill="white">
							<path d="M20.3146 1.51531L14.7596 12.7785L2.33094 14.5905C0.102124 14.9138 -0.791105 17.6615 0.825214 19.2353L9.81705 27.9974L7.69032 40.375C7.30751 42.6124 9.66393 44.2882 11.6375 43.2419L22.7561 37.3976L33.8747 43.2419C35.8483 44.2797 38.2047 42.6124 37.8219 40.375L35.6952 27.9974L44.687 19.2353C46.3033 17.6615 45.4101 14.9138 43.1813 14.5905L30.7526 12.7785L25.1976 1.51531C24.2023 -0.492324 21.3184 -0.517845 20.3146 1.51531Z" />
						</mask>
						<path
							d="M20.3146 1.51531L14.7596 12.7785L2.33094 14.5905C0.102124 14.9138 -0.791105 17.6615 0.825214 19.2353L9.81705 27.9974L7.69032 40.375C7.30751 42.6124 9.66393 44.2882 11.6375 43.2419L22.7561 37.3976L33.8747 43.2419C35.8483 44.2797 38.2047 42.6124 37.8219 40.375L35.6952 27.9974L44.687 19.2353C46.3033 17.6615 45.4101 14.9138 43.1813 14.5905L30.7526 12.7785L25.1976 1.51531C24.2023 -0.492324 21.3184 -0.517845 20.3146 1.51531Z"
							fill="#f3f4f6"
							stroke="#d1d5db"
							strokeWidth="2"
							mask="url(#path-1-inside-1_174_294)"
							className={cn("transition-all duration-300 hover:fill-gray-200", {
								"animate-pulse": enablePulse,
							})}
							style={{
								animationDuration: enablePulse ? "2s" : undefined,
								animationIterationCount: enablePulse ? "infinite" : undefined,
							}}
						/>
					</>
				)}
			</svg>
		</div>
	);
};

export default StarIcon;
