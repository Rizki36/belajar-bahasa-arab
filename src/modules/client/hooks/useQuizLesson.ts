import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import useSystemSetting from "@/common/hooks/useSystemSetting";
import useStudent from "@/modules/client/hooks/useStudent";
import { type RouterOutput, trpc } from "@/utils/trpc";
import { QuizLessonFormSchema, type QuizLessonFormValues } from "../schema";

type LessonData = RouterOutput["student"]["lesson"]["data"];
type Answer = {
	questionId: string;
	answerId: string;
};

const maxHeartCount = 3;

type UseQuizLessonProps = {
	lesson: LessonData["lesson"] | undefined;
	bab: LessonData["bab"] | undefined;
	subBab: LessonData["subBab"] | undefined;
};

const useQuizLesson = (props: UseQuizLessonProps) => {
	const { lesson, bab, subBab } = props;

	const [score, setScore] = useState(0);
	const [star, setStar] = useState(0);
	const [isEnd, setIsEnd] = useState(false);
	const [questionIndex, setQuestionIndex] = useState(0);
	const [heartCount, setHeartCount] = useState(maxHeartCount);
	const [myAnswers, setMyAnswers] = useState<Answer[]>([]);

	const form = useForm<QuizLessonFormValues>({
		resolver: zodResolver(QuizLessonFormSchema),
	});

	const trpcUtils = trpc.useUtils();
	const { student } = useStudent();
	const { config, loading: loadingConfig } = useSystemSetting();

	const { data: questionList, isLoading: loadingQuestions } =
		trpc.student.lesson.listQuestion.useQuery(
			{
				lessonId: lesson?.id!,
			},
			{
				enabled: !!lesson?.id,
			},
		);

	const { mutate: checkAnswer, status: checkAnswerStatus } =
		trpc.student.lesson.checkAnswer.useMutation();

	const { mutate: submit, status: submitStatus } =
		trpc.student.lesson.submitQuiz.useMutation();

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

	const currentQuestion = questions[questionIndex];
	const questionText = currentQuestion?.question ?? "";
	const answers = currentQuestion?.answer ?? [];

	const isLoading = loadingQuestions || loadingConfig;
	const isSubmitting =
		checkAnswerStatus === "pending" || submitStatus === "pending";

	const endLesson = (heart: number, answers: Answer[]) => {
		if (!lesson || !student) return;

		submit(
			{
				studentId: student.id ?? "",
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
		if (!currentQuestion) return;

		checkAnswer(
			{
				questionId: currentQuestion.id,
				answerId: data.answer,
			},
			{
				onSuccess: (result) => {
					const isLastQuestion = questionIndex === questions.length - 1;

					const newMyAnswers = [
						...myAnswers,
						{
							questionId: currentQuestion.id,
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

	const handleContinue = () => {
		form.reset();
		setQuestionIndex((prev) => prev + 1);
	};

	const handleModalOpenChange = (open: boolean) => {
		setIsEnd(open);
	};

	return {
		// State
		score,
		star,
		isEnd,
		questionIndex,
		heartCount,
		questions,
		currentQuestion,
		questionText,
		answers,
		bab,
		subBab,

		// Loading states
		isLoading,
		isSubmitting,

		// Form
		form,

		// Functions
		onSubmit,
		handleContinue,
		handleModalOpenChange,
	};
};

export default useQuizLesson;
