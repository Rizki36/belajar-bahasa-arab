import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";

import { Spinner } from "@/common/components/ui/spinner";
import { trpc } from "@/utils/trpc";

import type { NextPageWithLayout } from "../_app";

const CreateStudentPage: NextPageWithLayout = () => {
	const router = useRouter();
	const { mutate } = trpc.student.self.createStudent.useMutation();

	useEffect(() => {
		mutate(undefined, {
			onSuccess: async () => {
				localStorage.removeItem("TOUR_STORAGE_KEY");
				await router.push("/belajar");
			},
			onError: async (e) => {
				console.error("Failed to create student", e);
				toast.error("Gagal membuat siswa");

				signOut({
					redirect: true,
					callbackUrl: "/",
				}).catch((error) => {
					console.error("Sign out error", error);
				});
			},
		});
	}, []);

	return (
		<div className="h-screen flex items-center justify-center">
			<div>
				<Spinner size="large" />
			</div>
		</div>
	);
};

CreateStudentPage.auth = false;

export default CreateStudentPage;
