import { zodResolver } from "@hookform/resolvers/zod";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { type FC, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/common/components/ui/button";
import { Form } from "@/common/components/ui/form";
import { Progress } from "@/common/components/ui/progress";
import { Spinner } from "@/common/components/ui/spinner";
import useSystemSetting from "@/common/hooks/useSystemSetting";
import ShareSection from "@/modules/client/components/belajar/ShareSection";
import EndModal from "@/modules/client/components/lesson/EndModal";
import useStudent from "@/modules/client/hooks/useStudent";
import { type RouterOutput, trpc } from "@/utils/trpc";
import { QuizLessonFormSchema, type QuizLessonFormValues } from "../../schema";
import AnswerButton from "./AnswerButton";
import AnswerOption from "./AnswerOption";

type LessonData = RouterOutput["student"]["lesson"]["data"];

const maxHeartCount = 3;

const QuizLesson: FC<{
	lesson: LessonData["lesson"] | undefined;
	bab: LessonData["bab"] | undefined;
	subBab: LessonData["subBab"] | undefined;
}> = ({ bab, subBab, lesson }) => {
	const [score, setScore] = useState(0);
	const [star, setStar] = useState(0);
	const [isEnd, setIsEnd] = useState(false);
	const [questionIndex, setQuestionIndex] = useState(0);
	const [heartCount, setHeartCount] = useState(maxHeartCount);
	const [myAnswers, setMyAnswers] = useState<
		{
			questionId: string;
			answerId: string;
		}[]
	>([]);

	const form = useForm<QuizLessonFormValues>({
		resolver: zodResolver(QuizLessonFormSchema),
	});

	const trpcUtils = trpc.useUtils();

	const { data: questionList, isLoading: loadingQuestions } =
		trpc.student.lesson.listQuestion.useQuery({
			lessonId: lesson?.id!,
		});
	const { mutate: checkAnswer, status: checkAnswerStatus } =
		trpc.student.lesson.checkAnswer.useMutation();
	const { mutate: submit, status: submitStatus } =
		trpc.student.lesson.submitQuiz.useMutation();
	const { config, loading: loadingConfig } = useSystemSetting();

	const { student } = useStudent();

	const questions = useMemo(() => {
		if (!questionList?.questions?.length || loadingConfig) return [];

		let result = [...questionList.questions];

		result = result.map((question) => {
			return {
				...question,
				answer: question.answer.sort((a, b) => {
					return config.randomizeAnswer
						? Math.random() - 0.5
						: a.number - b.number;
				}),
			};
		});

		result = result.sort((a, b) => {
			return config?.randomizeQuestion
				? Math.random() - 0.5
				: a.number - b.number;
		});

		return result;
	}, [questionList, config, loadingConfig]);

	if (loadingQuestions || loadingConfig)
		return (
			<div className="h-screen flex justify-center items-center">
				<Spinner size="large" />
			</div>
		);

	const question = questions[questionIndex];
	const questionText = question?.question ?? "";
	const answers = question?.answer ?? [];

	if (!bab || !subBab || !lesson) return null;

	const endLesson = (
		heart: number,
		answers: {
			questionId: string;
			answerId: string;
		}[],
	) => {
		submit(
			{
				studentId: student?.id ?? "",
				lessonId: lesson.id,
				heartCount: heart,
				answers,
			},
			{
				onSuccess: (data) => {
					setIsEnd(true);
					setScore(data.score);
					setStar(data.star);
					trpcUtils.student.learn.subBabList.invalidate();
					trpcUtils.student.listBab.listBab.invalidate();
				},
				onError: (error) => {
					console.error(error);
				},
			},
		);
	};

	const onSubmit = (data: QuizLessonFormValues) => {
		checkAnswer(
			{
				questionId: question.id,
				answerId: data.answer,
			},
			{
				onSuccess: (result) => {
					const isLastQuestion = questionIndex === questions.length - 1;

					const newMyAnswers = [
						...myAnswers,
						{
							questionId: question.id,
							answerId: data.answer,
						},
					];

					const newHeartCount = result.isCorrect ? heartCount : heartCount - 1;
					const isHeartCountZero = newHeartCount <= 0;

					setMyAnswers(newMyAnswers);

					if (!result.isCorrect) {
						form.setValue("isIncorrect", true);
						setHeartCount((prev) => prev - 1);
					}

					if (isLastQuestion || isHeartCountZero) {
						return endLesson(newHeartCount, newMyAnswers);
					}

					if (result.isCorrect) {
						setQuestionIndex((prev) => prev + 1);
						form.reset();
					}
				},
				onError: (error) => {
					console.error(error);
				},
			},
		);
	};

	return (
		<>
			<EndModal
				score={score}
				star={star}
				open={isEnd}
				onOpenChange={(open) => {
					setIsEnd(open);
				}}
			/>
			<div className="bg-primary min-h-screen px-4 md:px-11">
				<div className="pt-6 sticky top-0 flex items-center justify-between md:mb-2">
					<Link href="/belajar">
						<Button variant="ghost" className="text-white">
							Keluar
						</Button>
					</Link>
					<div className="flex items-center text-white gap-x-2 text-lg">
						{heartCount} <HeartFilledIcon className="text-white size-6" />
					</div>
				</div>
				<div className="grid gap-y-5 xl:grid-cols-[700px,1fr] gap-x-12 pb-6">
					<div className="flex sticky bg-primary top-0 pt-3 md:pt-0 z-50 flex-col-reverse xl:flex-col">
						<div className="bg-white py-6 xl:pb-0 rounded-xl">
							<div className="flex select-none p-8 text-xl font-semibold items-center justify-center w-full mix-h-[200px] xl:min-h-[400px] text-center mb-3">
								{questionText}
							</div>
							<ShareSection
								url={window?.location?.href ?? ""}
								variant="ghost"
								className="border-none hidden xl:flex"
							/>
						</div>
						<div className="group flex-col-reverse xl:flex-col items-center flex justify-center lg:mt-3 lg:mb-0 mt-0 mb-3">
							<Progress
								value={(questionIndex / questions.length) * 100}
								variant="white"
								className="w-full transition duration-300 group-hover:opacity-100 opacity-50 mb-2"
							/>
							<div className="flex justify-between w-full transition duration-300 text-white/50 group-hover:text-white">
								<div>
									Bab {bab.number}{" "}
									{subBab.name ? `- Unit ${subBab.number}` : `: ${bab.name}`}
								</div>
								<div>
									{questionIndex + 1} dari {questions.length} soal
								</div>
							</div>
						</div>
					</div>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)}>
							<div className="space-y-6">
								{answers.map((answer) => (
									<AnswerOption
										key={answer.id}
										answer={answer}
										form={form}
										loading={
											checkAnswerStatus === "pending" ||
											submitStatus === "pending"
										}
									/>
								))}
							</div>
							<hr className="my-5" />
							<div>
								<AnswerButton
									form={form}
									onContinue={() => {
										form.reset();
										setQuestionIndex((prev) => prev + 1);
									}}
									loading={
										checkAnswerStatus === "pending" ||
										submitStatus === "pending"
									}
								/>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</>
	);
};

export default QuizLesson;
