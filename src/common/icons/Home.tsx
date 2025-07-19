import * as React from "react";

const HomeIcon = (props: React.JSX.IntrinsicElements["svg"]) => {
	const homeGradient = React.useId();
	const homeGradient2 = React.useId();
	const homeGradient3 = React.useId();
	const homeGradient4 = React.useId();
	const homeGradient19 = React.useId();

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			viewBox="0 0 120 120"
			{...props}
		>
			<defs>
				<linearGradient
					id={homeGradient}
					x1={56.47}
					x2={73.52}
					y1={112.51}
					y2={428.95}
					data-name="New Gradient Swatch 17"
					gradientTransform="rotate(6.64 988.426 100.232)"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset={0} stopColor="#ffd188" />
					<stop offset={0.5} stopColor="#e58e0e" />
					<stop offset={1} stopColor="#5c3600" />
				</linearGradient>
				<linearGradient
					xlinkHref={`#${homeGradient}`}
					id={homeGradient2}
					x1={48.34}
					x2={63.03}
					y1={109.06}
					y2={241.04}
					data-name="New Gradient Swatch 17"
				/>
				<linearGradient
					xlinkHref={`#${homeGradient}`}
					id={homeGradient3}
					x1={86.58}
					x2={89.1}
					y1={132.86}
					y2={216.55}
					data-name="New Gradient Swatch 17"
				/>
				<linearGradient
					xlinkHref={`#${homeGradient}`}
					id={homeGradient4}
					x1={29.19}
					x2={31.71}
					y1={132.86}
					y2={216.55}
					data-name="New Gradient Swatch 17"
				/>
				<linearGradient
					id={homeGradient19}
					x1={53.16}
					x2={77.36}
					y1={92.15}
					y2={309.61}
					data-name="New Gradient Swatch 19"
					gradientTransform="rotate(6.64 988.426 100.232)"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset={0} stopColor="#fa8" />
					<stop offset={0.5} stopColor="#ce4b17" />
					<stop offset={1} stopColor="#5c1700" />
				</linearGradient>
			</defs>
			<g
				style={{
					isolation: "isolate",
				}}
			>
				<g id="Layer_2" data-name="Layer 2">
					<g id="OBJECTS">
						<path
							d="M0 0h120v120H0z"
							style={{
								strokeWidth: 0,
								fill: "none",
							}}
						/>
						<path
							d="M85 119.98c-24.17-1.49-46.58-3.81-66.08-7.5-4.55-.86-7.89-4.29-7.95-8.21-.26-17.94.62-36.75 4.45-56 .81-4.06 5.13-6.8 10.01-6.45 22.52 1.63 47.09 4.79 69.42 8.52 4.82.8 8.36 4.5 8.18 8.64-.82 18.56-3.96 36.7-8.23 54.75-.92 3.9-5.08 6.56-9.8 6.27Z"
							style={{
								fill: `url(#${homeGradient})`,
								strokeWidth: 0,
							}}
						/>
						<path
							d="M56.56 76.14c-18.12-2.11-19.41 25.62-18.96 39.33 8.41 1.19 17.24 2.14 26.4 2.9 4.26-13.23 10.6-40.13-7.44-42.23Z"
							style={{
								fill: `url(#${homeGradient2})`,
								strokeWidth: 0,
							}}
						/>
						<path
							d="M77.93 96.43a2.446 2.446 0 0 1-1.84-2.42c.08-5.05 1.03-18.51 8.84-17.99 7.77.52 6.08 14.24 5.15 19.46a2.467 2.467 0 0 1-2.43 2.02c-3.47 0-6.74-.31-9.72-1.07Z"
							style={{
								fill: `url(#${homeGradient3})`,
								strokeWidth: 0,
							}}
						/>
						<path
							d="M20.93 89.79a2.446 2.446 0 0 1-1.84-2.42c.08-5.05 1.03-18.51 8.84-17.99 7.77.52 6.08 14.24 5.15 19.46a2.467 2.467 0 0 1-2.43 2.02c-3.47 0-6.74-.31-9.72-1.07Z"
							style={{
								fill: `url(#${homeGradient4})`,
								strokeWidth: 0,
							}}
						/>
						<path
							d="M85 119.98c4.72.29 8.88-2.36 9.8-6.27 4.27-18.05 7.41-36.19 8.23-54.75.18-4.14-3.36-7.83-8.18-8.64-2.67-.44-5.37-.88-8.09-1.31-.13 2.13.29 4.32 1.39 6.42 4.06 7.78 3.29 18.52.28 26.52-3.32 8.84-10.1 16.32-18.56 20.51-9.92 4.9-21.49 5.2-32.49 3.98-8.85-.99-17.59-2.88-26.42-3.92 0 .58 0 1.16.02 1.74.06 3.93 3.4 7.35 7.95 8.21 19.5 3.69 41.9 6.01 66.08 7.5Z"
							style={{
								mixBlendMode: "multiply",
								fill: "#e58e0e",
								opacity: 0.3,
								strokeWidth: 0,
							}}
						/>
						<path
							d="M6.51 43.8C21.75 26.94 39.06 12.77 58.57 1.43 62.75-1 68.44-.27 71.79 3.18c18.34 18.83 33.81 37.16 42.83 54.34 2.96 5.64-1.3 11.99-8.28 12.25-27.04.99-59.52-4.27-94.07-11.9-7.14-1.58-10.23-9.11-5.76-14.05Z"
							style={{
								fill: `url(#${homeGradient19})`,
								strokeWidth: 0,
							}}
						/>
						<path
							d="M71.79 3.17C70.11 1.45 67.85.4 65.48.1c1.68 2.02 3.42 4.01 4.96 6.1 2.69 3.67 5.21 7.47 7.54 11.38 2.57 4.31 4.91 8.75 7.01 13.3 3.46 7.5 6.07 16.97 1 23.49-2.6 3.35-6.81 5.16-11.02 5.73-4.21.57-8.48.05-12.69-.47-18.37-2.28-36.75-4.56-55.12-6.83-.63-.08-1.26-.15-1.9-.22 1.2 2.48 3.65 4.54 7 5.28 34.55 7.64 67.04 12.89 94.07 11.9 6.98-.26 11.24-6.61 8.28-12.25-9.02-17.18-24.49-35.5-42.83-54.34Z"
							style={{
								fill: "#ce4b17",
								opacity: 0.2,
								mixBlendMode: "multiply",
								strokeWidth: 0,
							}}
						/>
						<path
							d="M29.84 27.76c-.6.63-1.2 1.28-1.55 2.07-.35.79-.41 1.77.06 2.49.52.8 1.52 1.12 2.45 1.31 5.96 1.23 12.34-.47 17.27-4.03C53 26.04 56.54 20.74 58.55 15c.58-1.65 1.74-6.05-.93-6.63-1.97-.42-4.77 1.92-6.37 2.82-5.02 2.82-9.78 6.1-14.19 9.8a92.362 92.362 0 0 0-7.23 6.76ZM19.44 39.17c-.31.36-.6.76-.76 1.21-.16.45-.16.98.09 1.39.39.65 1.25.82 2.01.84 1.81.04 3.63-.45 5.17-1.4.7-.43 1.38-1.01 1.58-1.8.37-1.51-1.08-2.92-2.38-3.41-1.27-.47-2.68.57-3.67 1.28-.75.54-1.43 1.17-2.03 1.88Z"
							className="cls-2"
							strokeWidth={0}
							fill="#fff"
							mix-blend-mode="soft-light"
						/>
					</g>
				</g>
			</g>
		</svg>
	);
};
export default HomeIcon;
