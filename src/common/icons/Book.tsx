import type { SVGProps } from "react";
import { useId } from "react";

const Book = (props: SVGProps<SVGSVGElement>) => {
	const gradientA = useId();
	const gradientB = useId();
	const gradientC = useId();
	const gradientD = useId();
	const gradientE = useId();
	const gradientF = useId();

	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" {...props}>
			<defs>
				<linearGradient
					id={gradientA}
					x2={1}
					gradientTransform="matrix(205.792 730.478 -725.572 204.41 33.996 -349.079)"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset={0} stopColor="#cfb7ff" />
					<stop offset={0.33} stopColor="#7443dc" />
					<stop offset={0.66} stopColor="#4a2792" />
					<stop offset={1} stopColor="#140025" />
				</linearGradient>
				<linearGradient
					id={gradientB}
					x2={1}
					gradientTransform="matrix(150.197 533.151 -447.304 126.012 121.063 47.297)"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset={0} stopColor="#ffd188" />
					<stop offset={0.5} stopColor="#e58e0e" />
					<stop offset={1} stopColor="#5c3600" />
				</linearGradient>
				<linearGradient
					id={gradientC}
					x2={1}
					gradientTransform="matrix(149.024 528.986 -453.11 127.648 64.313 -113.859)"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset={0} stopColor="#cfb7ff" />
					<stop offset={0.33} stopColor="#7443dc" />
					<stop offset={0.66} stopColor="#4a2792" />
					<stop offset={1} stopColor="#140025" />
				</linearGradient>
				<linearGradient
					id={gradientD}
					x2={1}
					gradientTransform="matrix(-3.516 632.979 -417.202 -2.318 151.624 -189.471)"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset={0} stopColor="#cfb7ff" />
					<stop offset={0.33} stopColor="#7443dc" />
					<stop offset={0.66} stopColor="#4a2792" />
					<stop offset={1} stopColor="#140025" />
				</linearGradient>
				<linearGradient
					id={gradientE}
					x2={1}
					gradientTransform="matrix(140.606 499.095 -480.727 135.431 8.95 -239.629)"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset={0} stopColor="#cfb7ff" />
					<stop offset={0.33} stopColor="#7443dc" />
					<stop offset={0.66} stopColor="#4a2792" />
					<stop offset={1} stopColor="#140025" />
				</linearGradient>
				<linearGradient
					id={gradientF}
					x2={1}
					gradientTransform="matrix(286.561 1017.178 -868.633 244.713 13.839 -362.459)"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset={0} stopColor="#ffd188" />
					<stop offset={0.5} stopColor="#e58e0e" />
					<stop offset={1} stopColor="#5c3600" />
				</linearGradient>
			</defs>
			<path
				d="M119.8 95.6C112.7 63.7 107.4 28.2 98.7 7c-.8-2-2.9-3-5-2.5-26.6 6.6-59 16.2-73.5 22.2-1 .4-1.5 1.5-1.3 2.5 5.8 27.2 14.5 55.1 23.3 79.2l-4.3-3.2-10 9.4c1.8 1.6 17.5 3.9 19.6 3.6q.2 0 .4-.1c25.9-5.7 53.4-12.7 70.6-20 1-.4 1.6-1.5 1.3-2.5z"
				style={{
					fill: `url(#${gradientA})`,
				}}
			/>
			<path
				d="M110 95.3c-16.5 7-36.4 13.6-61.7 18.8-5 1-13.2-2.7-13.6-3.7-9.5-24.7-14.1-52.1-20.4-81.3-.2-1 .3-2 1.3-2.4C29.5 20.9 57.3 8.2 82.9 1.9c1.9-.5 7.3 4 8 5.9 8.4 20.3 13.5 54.5 20.4 85.1.2 1-.3 2-1.3 2.4z"
				style={{
					fill: `url(#${gradientB})`,
				}}
			/>
			<path
				d="M100.2 94.8c-17.2 7.3-44.7 14.3-70.6 20.1-1.1.2-2.2-.3-2.6-1.4C17.2 87.8 7.1 56.4.6 25.9c-.3-1 .3-2 1.3-2.4C16.3 17.4 48.8 7.8 75.4 1.2c2-.5 4.1.6 4.9 2.5 8.7 21.2 14 56.8 21.2 88.6.2 1.1-.3 2.1-1.3 2.5z"
				style={{
					fill: `url(#${gradientC})`,
				}}
			/>
			<path
				d="M101.5 92.3C94.3 60.5 89 24.9 80.3 3.7c-.8-1.9-2.9-3-4.9-2.5l-4 1c7.2 14.2 10 30.7 7.6 46.5-3.5 22.3-17.3 42.7-36.7 54.2-5.2 3.1-10.8 5.5-16.1 8.4l.8 2.2c.4 1.1 1.5 1.6 2.6 1.4 25.9-5.8 53.4-12.8 70.6-20.1 1-.4 1.5-1.4 1.3-2.5z"
				style={{
					fill: `url(#${gradientD})`,
				}}
			/>
			<path
				d="M51.1 30.1c-8.7 1.6-16.6 7.5-20.6 15.4s-4.1 17.7-.2 25.7c3.2 6.8 9.2 12.2 16.3 14.3 7.2 2.1 15.3.8 21.2-3.8 5.9-4.6 9.1-12.4 7.9-19.8-1.1-6.3-5.5-12-11.4-14.6-4.3-1.9-9.4-2.1-13.6 0-4.1 2.1-6.9 6.9-6.2 11.5.8 4.6 5.6 8.4 10.2 7.3 1.4-.3 3-1.4 2.9-2.9-.1-1.9-2.7-2.8-3.2-4.6-.4-1.4.6-2.9 1.9-3.4 1.4-.6 2.9-.3 4.2.4 3.7 1.9 5.5 6.7 4.3 10.7-1.2 4-5.1 6.9-9.3 7.4-4.1.5-8.4-1.3-11.4-4.2-2.9-3-4.6-7.1-5.2-11.2-.6-5.1.5-10.5 3.8-14.5 3.2-3.9 8.8-6.1 13.7-4.6 2.3.6 4.4 2 6.4 3.3 2 1.3 4.2 2.5 6.6 2.9 2.3.4 5-.3 6.5-2.2 3.7-4.9-3.3-8.9-6.8-10.6-5.5-2.7-11.9-3.6-18-2.5z"
				style={{
					fill: `url(#${gradientE})`,
				}}
			/>
			<path
				d="M15.5 28.5c-1.7 2.2-2.8 4.9-3.4 7.6-.9 3.6-1.1 7.3-.5 10.9.6 3.6 2.1 7.1 4.5 9.9.5.7 1.3 1.3 2.1 1.1.8-.2 1.2-1 1.4-1.8.9-3.5.7-7.1.8-10.6.1-3.6.7-7.3 2.7-10.2 1.2-1.6 2.7-2.8 3.7-4.4 1-1.6 1.4-3.9.2-5.3-3.2-4-9.3-.1-11.5 2.8z"
				style={{
					mixBlendMode: "soft-light",
					fill: "#fff",
				}}
			/>
			<path
				fillRule="evenodd"
				d="M10.5 23.1s1.3 5.2-.3 6.3c-1.7 1.1-4 .9-4 .9s-.3 7.7-2.3 8.4C1.8 39.3-.2 26.3 0 24c.2-1.8 11.9-5.3 16.7-6.7 1-.3 1.7.8 1.1 1.6-2.2 2.7-7.3 4.2-7.3 4.2zM77.4 0c1.1-.2 2.3.5 2.7 1.5 1.5 3.7 4.8 12 4.1 13.3-.8 1.7-6.9-5.6-6.9-5.6s-2.4 1.5-4.2.7C71.2 9.1 71 5.4 71 5.4s-9.5 1.1-9.6-.6C61.3 3.4 72.2 1 77.4 0zM27 105.2s2.6-1 4.7.9c2.1 2 .8 4.3.8 4.3s7.1.7 7 2.3c-.2 1.7-8.9 3.1-11.7 2.3-2.2-.6-4.7-8.9-5.8-13.1-.2-.8.8-1.4 1.4-.9 2 1.8 3.6 4.2 3.6 4.2zm76-11.3c-.5 2.2-12 6.5-13.1 4.8-1-1.6 7-8.8 7-8.8s-2.6-.9-2.6-3.5c0-2.5 2.7-3.5 2.7-3.5-.3-2.3.3-6.9 1.1-6.6 3.2 1.3 5.4 15.3 4.9 17.6z"
				style={{
					fill: `url(#${gradientF})`,
				}}
			/>
		</svg>
	);
};
export default Book;
