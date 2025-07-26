import { useRouter } from "next/router";
import { Button } from "@/common/components/ui/button";
import { Spinner } from "@/common/components/ui/spinner";
import { cn } from "@/common/utils";
import type { NextPageWithLayout } from "@/pages/_app";
import { trpc } from "@/utils/trpc";

const BabLessonsPage: NextPageWithLayout = () => {
	const router = useRouter();

	const { data, isLoading, error } = trpc.admin.bab.babLesson.useQuery(
		{
			id: router.query.babId as string,
		},
		{
			enabled: router.isReady,
		},
	);

	if (isLoading) {
		return (
			<div className="w-full h-screen flex items-center justify-center">
				<Spinner size="large" />
			</div>
		);
	}

	if (error) {
		return (
			<div className="w-full h-screen flex items-center justify-center">
				{error.message}
			</div>
		);
	}

	if (!data?.bab) {
		router.replace("/admin/bab");
		return (
			<div className="w-full h-screen flex items-center justify-center"></div>
		);
	}

	return (
		<div className="mx-11">
			<div className="print:hidden mt-5 mb-4">
				<Button variant="ghost" onClick={() => router.back()}>
					Kembali
				</Button>
				<Button
					onClick={() => {
						window.print();
					}}
				>
					Print
				</Button>
			</div>

			<h1 className="text-xl font-bold">
				Bab {data?.bab?.number} : {data?.bab?.name}
			</h1>

			<hr className="my-3" />

			{data?.subBabList?.map((subBab) => (
				<section key={subBab.id}>
					{subBab.name ? (
						<div className="text-xl font-bold">
							Sub Bab {subBab.number} : {subBab.name}
						</div>
					) : null}

					{subBab.lesson.map((lesson) => (
						<div key={lesson.id} className="ml-3 mb-3">
							<div className="text-xl font-semibold mb-2">
								Pelajaran {lesson.number}
							</div>

							{lesson.question.map((question) => (
								<div key={question.id} className="ml-3 mb-1">
									<h1 className="text-lg">
										{question.number}) {question.question}
									</h1>

									{question.answer.map((answer) => (
										<p
											key={answer.id}
											className={cn("ml-4", {
												"text-red-500": answer.isCorrect,
											})}
										>
											{answer.answer}
										</p>
									))}
								</div>
							))}
						</div>
					))}
				</section>
			))}
		</div>
	);
};

export default BabLessonsPage;
