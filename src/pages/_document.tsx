import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
	return (
		<Html lang="en">
			<Head>
				<link rel="icon" href="/icon.png" type="image/png" />
				<link rel="manifest" href="/manifest.json" />
				<link rel="apple-touch-icon" href="/icon.png"></link>
				<meta name="theme-color" content="#fff" />
				<meta name="description" content="Belajar Bahasa Arab Online" />
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
