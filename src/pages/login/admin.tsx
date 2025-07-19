import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { signIn } from "next-auth/react";
import React from "react";

import Button3D from "@/common/components/ui/3d-button";

import { NextPageWithLayout } from "../_app";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	// get secret from query

	const secret = query?.secret as string;

	if (secret !== process.env.CREATE_ADMIN_SECRET) {
		// redirect to login
		return {
			redirect: {
				destination: "/",
				permanent: false,
			},
		};
	}

	return {
		props: {
			secret,
		},
	};
};

const AdminLoginPage: NextPageWithLayout<
	InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ secret }) => {
	return (
		<main className="mx-auto max-w-screen-2xl">
			<section className="flex items-center justify-center h-screen px-3 md:px-7">
				<Button3D
					onClick={() => {
						signIn(
							"google",
							{ callbackUrl: `/create-admin?secret=${secret}` },
							{
								prompt: "consent",
							},
						);
					}}
				>
					Masuk sebagai admin
				</Button3D>
			</section>
		</main>
	);
};

AdminLoginPage.auth = false;

export default AdminLoginPage;
