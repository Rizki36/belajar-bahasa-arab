import { QuestionFormSchemaType } from "../components/lesson/QuestionForm.type";
import {
  getNewQuestionsAndAnswers,
  getRemovedQuestionsAndAnswers,
  getUpdatedQuestionsAndAnswers,
} from "./getter";

export const formatQuestionFormPayload = (
  defaultItems: QuestionFormSchemaType["items"],
  currentItems: QuestionFormSchemaType["items"]
) => {
  const { removedQuestions, removedAnswers } = getRemovedQuestionsAndAnswers(
    defaultItems,
    currentItems
  );

  const { newQuestions, newAnswers } = getNewQuestionsAndAnswers(
    defaultItems,
    currentItems
  );

  const { updatedQuestions, updatedAnswers } = getUpdatedQuestionsAndAnswers(
    defaultItems,
    currentItems
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
