import type { QuestionFormValues } from "../schema";
import {
	getNewQuestionsAndAnswers,
	getRemovedQuestionsAndAnswers,
	getUpdatedQuestionsAndAnswers,
} from "./getter";

export const formatQuestionFormPayload = (
	defaultItems: QuestionFormValues["items"],
	currentItems: QuestionFormValues["items"],
) => {
	const { removedQuestions, removedAnswers } = getRemovedQuestionsAndAnswers(
		defaultItems,
		currentItems,
	);

	const { newQuestions, newAnswers } = getNewQuestionsAndAnswers(
		defaultItems,
		currentItems,
	);

	const { updatedQuestions, updatedAnswers } = getUpdatedQuestionsAndAnswers(
		defaultItems,
		currentItems,
	);

	return {
		removedQuestions,
		removedAnswers,
		newQuestions,
		newAnswers,
		updatedQuestions,
		updatedAnswers,
	};
};
