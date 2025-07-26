/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { Nunito } from "next/font/google";
import { useRouter } from "next/router";
import { SessionProvider, useSession } from "next-auth/react";
import { type ReactElement, type ReactNode, useEffect } from "react";

import "@/styles/globals.css";

import { Toaster } from "@/common/components/ui/sonner";
import useStudent from "@/modules/client/hooks/useStudent";
import { trpc } from "@/utils/trpc";

const nunito = Nunito({
	weight: ["400", "500", "600", "700"],
	subsets: ["latin"],
	display: "swap",
	style: ["normal", "italic"],
});

export type NextPageWithLayout<P = unknown, IP = P> = NextPage<P, IP> & {
	auth?: boolean;
	getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

const Content: React.FC<{
	Component: NextPageWithLayout;
	// @ts-ignore
	// biome-ignore lint/suspicious/noExplicitAny: fixme
	pageProps: any;
}> = ({ Component, pageProps }) => {
	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout ?? ((page) => page);

	return (
		<main className={nunito.className}>
			{getLayout(<Component {...pageProps} />)}
			<Toaster />
		</main>
	);
};

const App = ({
	Component,
	pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
	const checkAuth = Component.auth === undefined ? true : Component.auth;

	return (
		<SessionProvider session={session}>
			{checkAuth ? (
				<Auth>
					<Content Component={Component} pageProps={pageProps} />
				</Auth>
			) : (
				<Content Component={Component} pageProps={pageProps} />
			)}
		</SessionProvider>
	);
};

const useStudentCheck = ({ role }: { role: string | undefined }) => {
	const router = useRouter();

	const { loadingStudent, student } = useStudent({
		enabled: role === "student",
	});

	useEffect(() => {
		if (role !== "student" || loadingStudent) return;

		if (!student) {
			router.push("/create-student").catch((e) => console.error(e));
		}
	}, [student, loadingStudent, role]);

	return {
		checkingStudent: loadingStudent && role === "student",
	};
};

// TODO: refactor this, because it's redundant with the middleware
const Auth: React.FC<{
	children: ReactNode;
}> = ({ children }) => {
	// if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
	const { status, data: sessionData } = useSession({ required: true });

	const { checkingStudent } = useStudentCheck({
		role: sessionData?.user?.role,
	});

	if (status === "loading" || checkingStudent) {
		return <div></div>;
	}

	return children;
};

export default trpc.withTRPC(App);
