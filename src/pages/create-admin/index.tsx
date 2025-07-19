import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import React, { useEffect } from "react";
import { toast } from "sonner";

import { Spinner } from "@/common/components/ui/spinner";
import { NextPageWithLayout } from "@/pages/_app";
import { trpc } from "@/utils/trpc";

const CreateAdminPage: NextPageWithLayout = () => {
	const router = useRouter();
	const { mutate } = trpc.admin.self.createAdmin.useMutation();

	useEffect(() => {
		mutate(
			{
				secret: router.query.secret as string,
			},
			{
				onSuccess: async () => {
					toast.success("Admin berhasil dibuat, silahkan login ulang");
					signOut({ redirect: true, callbackUrl: "/admin" }).catch((error) => {
						console.error("Sign out error", error);
					});
				},
				onError: async (e) => {
					console.error("Failed to create admin", e);
					toast.error("Gagal membuat admin");

					signOut({
						redirect: true,
						callbackUrl: "/",
					}).catch((error) => {
						console.error("Sign out error", error);
					});
				},
			},
		);
	}, []);

	return (
		<div className="h-screen flex items-center justify-center">
			<div>
				<Spinner size="large" />
			</div>
		</div>
	);
};

CreateAdminPage.auth = false;

export default CreateAdminPage;
