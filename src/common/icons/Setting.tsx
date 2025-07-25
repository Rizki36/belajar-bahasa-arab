import * as React from "react";

const SettingIcon = (props: React.JSX.IntrinsicElements["svg"]) => {
	const settingLinearGradient = React.useId();
	const settingLinearGradient2 = React.useId();
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			xmlnsXlink="http://www.w3.org/1999/xlink"
			viewBox="0 0 120 120"
			{...props}
		>
			<defs>
				<linearGradient
					id={settingLinearGradient}
					x1={52.1}
					x2={93.82}
					y1={-17.18}
					y2={390.58}
					gradientUnits="userSpaceOnUse"
				>
					<stop offset={0} stopColor="#b7c8ff" />
					<stop offset={0.33} stopColor="#4369dc" />
					<stop offset={0.66} stopColor="#274192" />
					<stop offset={1} stopColor="#050625" />
				</linearGradient>
				<linearGradient
					xlinkHref={`#${settingLinearGradient}`}
					id={settingLinearGradient2}
					x1={52.66}
					x2={75.9}
					y1={-18.81}
					y2={208.33}
				/>
			</defs>
			<g
				style={{
					isolation: "isolate",
				}}
			>
				<g data-name="Layer 2">
					<g id="OBJECTS">
						<path
							d="M0 0h120v120H0z"
							style={{
								strokeWidth: 0,
								fill: "none",
							}}
						/>
						<path
							d="M115.09 77.13c-3.64-2.08-7.32-3.91-11.03-5.5.87-3.4 1.33-7 1.33-10.77 0-3.34-.34-6.59-.98-9.73 3.76-.82 7.38-1.73 10.79-2.74 2-.59 3.1-2.75 2.42-4.72-2.9-8.44-6.54-16.19-11.29-22.88-1.12-1.58-3.3-2-4.94-.98-3.63 2.24-7.05 4.64-10.28 7.19-4.78-4.5-10.57-7.9-17.06-9.83 1.16-3.75 2.17-7.41 2.98-10.94.47-2.03-.87-4.05-2.92-4.43C65.34.17 56.8-.47 48.64.37c-1.93.2-3.36 1.89-3.28 3.82.18 4.68.65 9.25 1.4 13.69a45.67 45.67 0 0 0-14.75 8.54c-2.86-3.36-5.73-6.5-8.59-9.36a3.676 3.676 0 0 0-5.3.13c-6.03 6.58-11.09 13.48-14.7 20.86-.85 1.74-.18 3.85 1.5 4.81 4.22 2.41 8.48 4.48 12.8 6.24-1 3.74-1.55 7.66-1.55 11.7 0 2.69.23 5.28.66 7.79-4.21.89-8.23 1.88-12.02 3.01-2 .59-3.1 2.75-2.42 4.72 2.9 8.44 6.54 16.19 11.29 22.88 1.12 1.58 3.3 2 4.94.98 3.94-2.43 7.64-5.05 11.11-7.85 4.65 4.18 10.29 7.33 16.64 9.19-1.33 4.21-2.48 8.3-3.39 12.25-.47 2.03.87 4.05 2.92 4.43 8.78 1.62 17.31 2.26 25.48 1.42 1.93-.2 3.36-1.89 3.28-3.82-.19-4.79-.68-9.45-1.45-13.99 5.74-1.52 10.99-4.04 15.52-7.41 2.63 3.04 5.25 5.9 7.88 8.53a3.676 3.676 0 0 0 5.3-.13c6.03-6.58 11.09-13.48 14.7-20.86.85-1.74.18-3.85-1.5-4.81Z"
							style={{
								fill: `url(#${settingLinearGradient})`,
								strokeWidth: 0,
							}}
						/>
						<path
							d="M8.5 35.14c-.5.9-.96 1.88-.96 2.91 0 1.03.6 2.13 1.6 2.39 1.15.3 2.26-.54 3.07-1.41 2.03-2.16 4.52-5.73 4.41-8.85-.11-3.06-3.56-1.18-4.72.08-1.33 1.44-2.45 3.16-3.4 4.87ZM16.98 22.84c-.53.71-1.04 1.54-.91 2.41.09.61.51 1.17 1.08 1.42.57.25 1.26.18 1.77-.17.65-.45.94-1.27 1.02-2.05.1-.95.02-2.48-.71-3.21-.8-.8-1.83 1.05-2.25 1.61Z"
							strokeWidth="0"
							mix-blend-mode="soft-light"
							fill="#fff"
						/>
						<path
							d="M61.41 25.7c-19.13 0-34.78 15.66-34.78 34.78s14.59 32.66 33.72 32.66 34.57-13.5 34.57-32.62S80.54 25.7 61.41 25.7Z"
							style={{
								fill: `url(#${settingLinearGradient2})`,
								strokeWidth: 0,
							}}
						/>
						<path
							d="M61.01 47.18c-6.95 0-12.63 5.69-12.63 12.63s5.3 11.86 12.25 11.86 12.56-4.9 12.56-11.85-5.22-12.64-12.17-12.64Z"
							style={{
								fill: "#fff",
								strokeWidth: 0,
							}}
						/>
						<path
							d="M50.57 30.37c-3.68 1.13-7.1 3.52-8.81 6.97-.26.52-.48 1.07-.51 1.64-.03.58.14 1.19.58 1.57.62.55 1.56.5 2.37.35 2.08-.38 4.05-1.17 6.01-1.95 3.29-1.32 6.59-2.64 9.88-3.96.81-.33 1.66-.67 2.24-1.33.52-.59.78-1.4.7-2.17-.07-.62-.4-1.58-1.04-1.82-.66-.25-1.69-.15-2.39-.19-1.93-.11-3.88-.09-5.8.18-1.09.15-2.17.38-3.22.7Z"
							strokeWidth="0"
							mix-blend-mode="soft-light"
							fill="#fff"
						/>
						<path
							d="M117.63 43.67c-2.9-8.44-6.54-16.19-11.29-22.88-1.12-1.58-3.3-2-4.94-.98-3.63 2.24-7.05 4.64-10.28 7.19-4.78-4.5-10.57-7.9-17.06-9.83 1.16-3.75 2.17-7.41 2.98-10.94.47-2.03-.87-4.05-2.92-4.43-1.69-.31-3.37-.58-5.04-.81-1.35 9.84.79 20.14 6.77 28.19 4.83 6.51 11.78 11.51 15.19 18.86 4.1 8.86 1.98 19.89-4.17 27.47-6.15 7.58-15.8 11.84-25.53 12.67-9.73.82-19.52-1.54-28.47-5.43-9.63-4.18-19.51-10.25-29.63-10.18-.94.96-1.33 2.4-.86 3.76 2.9 8.44 6.54 16.19 11.29 22.88 1.12 1.58 3.3 2 4.94.98 3.94-2.43 7.64-5.05 11.11-7.85 4.65 4.18 10.29 7.33 16.64 9.19-1.33 4.21-2.48 8.3-3.39 12.25-.47 2.03.87 4.05 2.92 4.43 8.78 1.62 17.31 2.26 25.48 1.42 1.93-.2 3.36-1.89 3.28-3.82-.19-4.79-.68-9.45-1.45-13.99 5.74-1.52 10.99-4.04 15.52-7.41 2.63 3.04 5.25 5.9 7.88 8.53a3.676 3.676 0 0 0 5.3-.13c6.03-6.58 11.09-13.48 14.7-20.86.85-1.74.18-3.85-1.5-4.81-3.64-2.08-7.32-3.91-11.03-5.5.87-3.4 1.33-7 1.33-10.77 0-3.34-.34-6.59-.98-9.73 3.76-.82 7.38-1.73 10.79-2.74 2-.59 3.1-2.75 2.42-4.72Z"
							style={{
								fill: "#274192",
								mixBlendMode: "multiply",
								opacity: 0.2,
								strokeWidth: 0,
							}}
						/>
					</g>
				</g>
			</g>
		</svg>
	);
};
export default SettingIcon;
