import Head from "next/head";
import { signOut } from "next-auth/react";
import React from "react";

import Button3D from "@/common/components/ui/3d-button";
import ClientMainLayout from "@/common/layouts/MainLayout";
import SettingForm from "@/modules/client/components/setting/Form";

import { NextPageWithLayout } from "../_app";

const SettingPage: NextPageWithLayout = () => {
	return (
		<>
			<Head>
				<title>Mudah belajar ilmu shorof</title>
			</Head>
			<div className="flex h-[calc(100vh-64px)] flex-col items-center py-12 px-4">
				<SettingForm />

				<Button3D
					className="md:hidden"
					onClick={async () => {
						await signOut({
							callbackUrl: "/",
							redirect: true,
						});
					}}
				>
					Keluar
				</Button3D>
			</div>
		</>
	);
};

SettingPage.getLayout = (page) => {
	return <ClientMainLayout>{page}</ClientMainLayout>;
};

export default SettingPage;
