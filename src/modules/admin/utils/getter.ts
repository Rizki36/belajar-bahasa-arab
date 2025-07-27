import type { QuestionFormValues } from "../schema";

const getRemovedQuestions = (
	defaultItems: QuestionFormValues["items"],
	currentItems: QuestionFormValues["items"],
) => {
	return defaultItems
		.filter((item) => {
			return !currentItems.some((formValueItem) => {
				return formValueItem.id === item.id;
			});
		})
		.map((item) => {
			return {
				id: item.id,
				question: item.question,
			};
		});
};

const getRemovedAnswers = (
	defaultAnswers: QuestionFormValues["items"][number]["answers"],
	currentAnswers: QuestionFormValues["items"][number]["answers"],
) => {
	return defaultAnswers.filter((item) => {
		return !currentAnswers.some((formValueItem) => {
			return formValueItem.id === item.id;
		});
	});
};

export const getRemovedQuestionsAndAnswers = (
	defaultItems: QuestionFormValues["items"],
	currentItems: QuestionFormValues["items"],
) => {
	const removedQuestions = getRemovedQuestions(defaultItems, currentItems);

	const removedAnswers = currentItems.flatMap((currentItem) => {
		const defaultAnswers =
			defaultItems.find((defaultItem) => defaultItem.id === currentItem.id)
				?.answers ?? [];
		return getRemovedAnswers(defaultAnswers, currentItem.answers);
	});

	return { removedQuestions, removedAnswers };
};

const getNewQuestions = (
	defaultItems: QuestionFormValues["items"],
	currentItems: QuestionFormValues["items"],
) => {
	return currentItems.filter((formValueItem) => {
		return !defaultItems.some((item) => {
			return formValueItem.id === item.id;
		});
	});
};

const getNewAnswers = (
	defaultAnswers: QuestionFormValues["items"][number]["answers"],
	currentAnswers: QuestionFormValues["items"][number]["answers"],
) => {
	return currentAnswers.filter((formValueItem) => {
		return !defaultAnswers.some((item) => {
			return formValueItem.id === item.id;
		});
	});
};

export const getNewQuestionsAndAnswers = (
	defaultItems: QuestionFormValues["items"],
	currentItems: QuestionFormValues["items"],
) => {
	const newQuestions = getNewQuestions(defaultItems, currentItems).map(
		(item) => {
			const copyItem = {
				id: item.id,
				question: item.question,
				number: item.number,
			};
			return copyItem;
		},
	);

	const newAnswers = currentItems.flatMap((currentItem) => {
		const defaultAnswers =
			defaultItems.find((defaultItem) => defaultItem.id === currentItem.id)
				?.answers ?? [];
		return getNewAnswers(defaultAnswers, currentItem.answers).map((answer) => ({
			questionId: currentItem.id,
			number: answer.number,
			id: answer.id,
			text: answer.text,
			isCorrect: answer.correct,
		}));
	});

	return { newQuestions, newAnswers };
};

const getUpdatedItems = (
	defaultItems: QuestionFormValues["items"],
	currentItems: QuestionFormValues["items"],
) => {
	return currentItems.filter((item) => {
		const defaultItem = defaultItems.find(
			(defaultItem) => defaultItem.id === item.id,
		);

		if (!defaultItem) return false;

		const copyDefault = { question: item.question, number: item.number };
		const copyCurrent = {
			question: defaultItem.question,
			number: defaultItem.number,
		};

		return JSON.stringify(copyDefault) !== JSON.stringify(copyCurrent);
	});
};

const getUpdatedAnswers = (
	defaultAnswers: QuestionFormValues["items"][number]["answers"],
	currentAnswers: QuestionFormValues["items"][number]["answers"],
) => {
	return currentAnswers.filter((item) => {
		const defaultItem = defaultAnswers.find(
			(defaultItem) => defaultItem.id === item.id,
		);

		if (!defaultItem) return false;

		const copyDefault = {
			text: item.text,
			correct: item.correct,
			number: item.number,
		};
		const copyCurrent = {
			text: defaultItem.text,
			correct: defaultItem.correct,
			number: defaultItem.number,
		};

		return JSON.stringify(copyDefault) !== JSON.stringify(copyCurrent);
	});
};

export const getUpdatedQuestionsAndAnswers = (
	defaultItems: QuestionFormValues["items"],
	currentItems: QuestionFormValues["items"],
) => {
	const updatedQuestions = getUpdatedItems(defaultItems, currentItems).map(
		(item) => {
			const copyItem = {
				id: item.id,
				question: item.question,
				number: item.number,
			};
			return copyItem;
		},
	);

	const updatedAnswers = currentItems.flatMap((currentItem) => {
		const defaultAnswers =
			defaultItems.find((defaultItem) => defaultItem.id === currentItem.id)
				?.answers ?? [];
		return getUpdatedAnswers(defaultAnswers, currentItem.answers).map(
			(answer) => ({
				id: answer.id,
				questionId: currentItem.id,
				number: answer.number,
				text: answer.text,
				isCorrect: answer.correct,
			}),
		);
	});

	return { updatedQuestions, updatedAnswers };
};
