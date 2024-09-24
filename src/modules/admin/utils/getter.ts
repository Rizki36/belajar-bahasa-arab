import { QuestionFormSchemaType } from "@/modules/admin/components/lesson/QuestionForm.type";

const getRemovedQuestions = (
  defaultItems: QuestionFormSchemaType["items"],
  currentItems: QuestionFormSchemaType["items"]
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
  defaultAnswers: QuestionFormSchemaType["items"][number]["answers"],
  currentAnswers: QuestionFormSchemaType["items"][number]["answers"]
) => {
  return defaultAnswers.filter((item) => {
    return !currentAnswers.some((formValueItem) => {
      return formValueItem.id === item.id;
    });
  });
};

export const getRemovedQuestionsAndAnswers = (
  defaultItems: QuestionFormSchemaType["items"],
  currentItems: QuestionFormSchemaType["items"]
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
  defaultItems: QuestionFormSchemaType["items"],
  currentItems: QuestionFormSchemaType["items"]
) => {
  return currentItems.filter((formValueItem) => {
    return !defaultItems.some((item) => {
      return formValueItem.id === item.id;
    });
  });
};

const getNewAnswers = (
  defaultAnswers: QuestionFormSchemaType["items"][number]["answers"],
  currentAnswers: QuestionFormSchemaType["items"][number]["answers"]
) => {
  return currentAnswers.filter((formValueItem) => {
    return !defaultAnswers.some((item) => {
      return formValueItem.id === item.id;
    });
  });
};

export const getNewQuestionsAndAnswers = (
  defaultItems: QuestionFormSchemaType["items"],
  currentItems: QuestionFormSchemaType["items"]
) => {
  const newQuestions = getNewQuestions(defaultItems, currentItems).map(
    (item) => {
      const copyItem = {
        id: item.id,
        question: item.question,
        number: item.number,
      };
      return copyItem;
    }
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
  defaultItems: QuestionFormSchemaType["items"],
  currentItems: QuestionFormSchemaType["items"]
) => {
  return defaultItems.filter((item) => {
    const currentItem = currentItems.find(
      (currentItem) => currentItem.id === item.id
    );

    if (!currentItem) return false;

    const copyDefault = { question: item.question, number: item.number };
    const copyCurrent = {
      question: currentItem.question,
      number: currentItem.number,
    };

    return JSON.stringify(copyDefault) !== JSON.stringify(copyCurrent);
  });
};

const getUpdatedAnswers = (
  defaultAnswers: QuestionFormSchemaType["items"][number]["answers"],
  currentAnswers: QuestionFormSchemaType["items"][number]["answers"]
) => {
  return defaultAnswers.filter((item) => {
    const currentItem = currentAnswers.find(
      (currentItem) => currentItem.id === item.id
    );

    if (!currentItem) return false;

    const copyDefault = {
      text: item.text,
      correct: item.correct,
      number: item.number,
    };
    const copyCurrent = {
      text: currentItem.text,
      correct: currentItem.correct,
      number: currentItem.number,
    };

    return JSON.stringify(copyDefault) !== JSON.stringify(copyCurrent);
  });
};

export const getUpdatedQuestionsAndAnswers = (
  defaultItems: QuestionFormSchemaType["items"],
  currentItems: QuestionFormSchemaType["items"]
) => {
  const updatedQuestions = getUpdatedItems(defaultItems, currentItems).map(
    (item) => {
      const copyItem = {
        id: item.id,
        question: item.question,
        number: item.number,
      };
      return copyItem;
    }
  );

  const updatedAnswers = currentItems.flatMap((currentItem) => {
    const defaultAnswers =
      defaultItems.find((defaultItem) => defaultItem.id === currentItem.id)
        ?.answers ?? [];
    return getUpdatedAnswers(defaultAnswers, currentItem.answers).map(
      (answer) => ({
        ...answer,
        questionId: currentItem.id,
        number: answer.number,
        id: answer.id,
        text: answer.text,
        isCorrect: answer.correct,
      })
    );
  });

  return { updatedQuestions, updatedAnswers };
};
