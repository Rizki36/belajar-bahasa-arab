import * as React from "react";

const ScoreIcon = (props: React.JSX.IntrinsicElements["svg"]) => {
	const scoreLinearGradient1 = React.useId();
	const scoreLinearGradient2 = React.useId();
	const scoreLinearGradient3 = React.useId();

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			viewBox="0 0 120 120"
			{...props}
		>
			<defs>
				<linearGradient
					id={scoreLinearGradient1}
					x1={54.56}
					x2={70.23}
					y1={-31.96}
					y2={234.55}
					gradientUnits="userSpaceOnUse"
				>
					<stop offset={0} stopColor="#ffd188" />
					<stop offset={0.5} stopColor="#e58e0e" />
					<stop offset={1} stopColor="#5c3600" />
				</linearGradient>
				<linearGradient
					xlinkHref={`#${scoreLinearGradient1}`}
					id={scoreLinearGradient2}
					x1={59.15}
					x2={99.22}
					y1={53.15}
					y2={401.53}
				/>
				<linearGradient
					xlinkHref={`#${scoreLinearGradient1}`}
					id={scoreLinearGradient3}
					x1={13.12}
					x2={50.25}
					y1={172.15}
					y2={344.32}
					gradientTransform="rotate(13.42 550.34 325.838)"
				/>
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
							d="M115.52 61.2c0 29.67-27.81 52.91-57.48 52.91S4.48 89.67 4.48 60 32.72 5.89 62.4 5.89s53.13 25.63 53.13 55.31Z"
							style={{
								fill: `url(#${scoreLinearGradient1})`,
								strokeWidth: 0,
							}}
						/>
						<path
							d="M99.33 21.66c2.29 6.16 3.56 12.8 3.56 19.66 0 29.67-27.81 52.91-57.48 52.91-14.73 0-28.04-6.03-37.7-15.73 7.48 20.68 27.14 35.61 50.33 35.61 29.67 0 57.48-23.24 57.48-52.91 0-15.22-6.18-29.36-16.19-39.54Z"
							style={{
								fill: "#e58e0e",
								mixBlendMode: "multiply",
								opacity: 0.3,
								strokeWidth: 0,
							}}
						/>
						<path
							d="M58.04 118.58C26.04 118.58 0 92.3 0 60S29.16 1.42 62.4 1.42 120 28.24 120 61.2c0 31.11-28.37 57.39-61.96 57.39Zm4.35-108.21C33.92 10.37 8.95 33.56 8.95 60s22.02 49.63 49.09 49.63S111.05 87 111.05 61.2c0-28.03-21.82-50.83-48.65-50.83Z"
							style={{
								fill: `url(#${scoreLinearGradient2})`,
								strokeWidth: 0,
							}}
						/>
						<path
							d="M71.64 26.69c3.38 6.25 6.25 12.08 7.71 16.71.27.87.89 1.59 1.7 2.02 6.04 3.2 11.57 6.45 15.58 9.86 1.5 1.28 1.6 3.57.26 5.02-4.81 5.2-9.44 9.71-13.67 12.62-.76.52-1.26 1.34-1.42 2.25-1.08 6.03-2.71 11.9-4.8 17.66-.69 1.9-2.85 2.84-4.7 2.03-5.43-2.39-10.71-5.47-15.86-9.13-.78-.55-1.74-.76-2.68-.59-5.88 1.06-11.98 1.32-18.26.94-2.03-.12-3.53-1.95-3.27-3.96.77-5.77 2.03-11.7 3.66-17.75.25-.92.13-1.9-.37-2.71-2.16-3.52-4.21-10.37-6.25-17.25-.58-1.97.64-4.02 2.65-4.43 5.99-1.24 12.04-1.91 18.14-1.96.9 0 1.77-.36 2.42-.99 4.7-4.57 9.42-8.48 14.14-11.55 1.72-1.12 4.04-.56 5.01 1.25Z"
							style={{
								fill: `url(#${scoreLinearGradient3})`,
								strokeWidth: 0,
							}}
						/>
						<path
							d="M18.82 40.32c-1.11 2.1-2.06 4.38-2.02 6.75.03 2.37 1.24 4.86 3.42 5.8 2.28.98 4.9.1 7.15-.95 4.95-2.33 9.49-5.52 13.38-9.37 3.63-3.59 8.02-8.54 9.44-13.56 1.19-4.22-2.23-7.09-6.17-7.51-4.89-.52-9.77 2.68-13.54 5.45-4.81 3.53-8.85 8.12-11.65 13.39ZM55.58 15.76c-.98.18-1.99.45-2.75 1.09-.77.64-1.22 1.75-.82 2.67.31.72 1.08 1.17 1.85 1.31.77.14 1.57.02 2.35-.1l7.13-1.08c1.23-.19 2.7-.53 2.96-1.96.2-1.12-.45-1.62-1.42-1.91-2.82-.83-6.45-.55-9.29-.02Z"
							className="cls-3"
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
export default ScoreIcon;
