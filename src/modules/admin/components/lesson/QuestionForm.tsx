import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/common/components/ui/button";
import { Form } from "@/common/components/ui/form";
import useSystemSetting from "@/common/hooks/useSystemSetting";
import { trpc } from "@/utils/trpc";

import { formatQuestionFormPayload } from "../../utils/formatter";
import { QuestionFormSchema } from "./QuestionForm.schema";
import { QuestionFormSchemaType } from "./QuestionForm.type";
import QuestionItem from "./QuestionItem";

const useSaveForm = ({ lessonId }: { lessonId: string }) => {
  const { mutateAsync: addBulkAnswer, isPending: addBulkAnswerPending } =
    trpc.admin.question.addBulkAnswer.useMutation();
  const { mutateAsync: addBulkQuestion, isPending: addBulkQuestionPending } =
    trpc.admin.question.addBulkQuestion.useMutation();
  const { mutateAsync: deleteBulkAnswer, isPending: deleteBulkAnswerPending } =
    trpc.admin.question.deleteBulkAnswer.useMutation();
  const {
    mutateAsync: deleteBulkQuestion,
    isPending: deleteBulkQuestionPending,
  } = trpc.admin.question.deleteBulkQuestion.useMutation();
  const { mutateAsync: updateBulkAnswer, isPending: updateBulkAnswerPending } =
    trpc.admin.question.updateBulkAnswer.useMutation();
  const {
    mutateAsync: updateBulkQuestion,
    isPending: updateBulkQuestionPending,
  } = trpc.admin.question.updateBulkQuestion.useMutation();

  const saving =
    addBulkAnswerPending ||
    addBulkQuestionPending ||
    deleteBulkAnswerPending ||
    deleteBulkQuestionPending ||
    updateBulkAnswerPending ||
    updateBulkQuestionPending;

  const save = async ({
    _defaultValues,
    _formValues,
  }: {
    _defaultValues?: QuestionFormSchemaType;
    _formValues?: QuestionFormSchemaType;
  }) => {
    const promises: Promise<unknown>[] = [];
    const {
      newQuestions,
      newAnswers,
      removedQuestions,
      removedAnswers,
      updatedQuestions,
      updatedAnswers,
    } = formatQuestionFormPayload(
      _defaultValues?.items || [],
      _formValues?.items || []
    );

    if (newQuestions.length > 0) {
      await addBulkQuestion({
        lessonId,
        questions: newQuestions,
      });
    }

    if (newAnswers.length > 0) {
      promises.push(
        addBulkAnswer({
          answers: newAnswers,
        })
      );
    }

    if (removedQuestions.length > 0) {
      promises.push(
        deleteBulkQuestion({
          questions: removedQuestions,
        })
      );
    }

    if (removedAnswers.length > 0) {
      promises.push(
        deleteBulkAnswer({
          answers: removedAnswers,
        })
      );
    }

    if (updatedQuestions.length > 0) {
      promises.push(
        updateBulkQuestion({
          lessonId,
          questions: updatedQuestions,
        })
      );
    }

    if (updatedAnswers.length > 0) {
      promises.push(
        updateBulkAnswer({
          answers: updatedAnswers,
        })
      );
    }

    await Promise.all(promises);
    toast.success("Berhasil menyimpan");
  };

  return {
    saving,
    save,
  };
};

const QuestionForm: React.FC<{
  lessonId: string;
  defaultValues?: QuestionFormSchemaType;
}> = ({ lessonId, defaultValues }) => {
  const trpcUtils = trpc.useUtils();
  const { config } = useSystemSetting();

  const { saving, save } = useSaveForm({ lessonId });

  const form = useForm<QuestionFormSchemaType>({
    resolver: zodResolver(QuestionFormSchema),
    defaultValues,
  });

  const {
    fields: itemsFields,
    append: appendItem,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = async (data: QuestionFormSchemaType) => {
    try {
      await save({ _defaultValues: defaultValues, _formValues: data });

      trpcUtils.admin.question.invalidate();
      toast.success("Berhasil menyimpan soal", {
        position: "top-center",
        description: "Soal berhasil disimpan.",
      });
    } catch (error) {
      toast.error("Gagal menyimpan soal", {
        position: "top-center",
        description:
          "Terjadi kesalahan saat menyimpan soal. Silahkan coba lagi.",
      });
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-xl sticky bg-white top-0 pb-4 pt-3 flex justify-between items-center">
          <h2>List Soal</h2>
          <div>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                const lastItem = itemsFields[itemsFields.length - 1];

                appendItem({
                  id: uuidv4(),
                  question: "",
                  number: lastItem ? lastItem.number + 1 : 1,
                  answers: [
                    {
                      id: uuidv4(),
                      text: "",
                      correct: false,
                      number: 1,
                    },
                    {
                      id: uuidv4(),
                      text: "",
                      correct: false,
                      number: 2,
                    },
                    {
                      id: uuidv4(),
                      text: "",
                      correct: false,
                      number: 3,
                    },
                    {
                      id: uuidv4(),
                      text: "",
                      correct: false,
                      number: 4,
                    },
                    {
                      id: uuidv4(),
                      text: "",
                      correct: false,
                      number: 5,
                    },
                  ],
                });
              }}
            >
              Tambah Soal
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {itemsFields.map((question, index) => {
            return (
              <QuestionItem
                key={question.id}
                control={form.control}
                questionIndex={index}
                remove={remove}
                score={config.defaultScore}
              />
            );
          })}
        </div>

        <div>
          <Button type="submit" disabled={saving}>
            Simpan
          </Button>
        </div>
      </form>
    </Form>
  );
};

const Wrapper: React.FC<{ lessonId: string }> = ({ lessonId }) => {
  const { data, isLoading } = trpc.admin.question.list.useQuery(
    {
      lessonId,
      with: ["answers"],
    },
    {
      enabled: !!lessonId,
    }
  );

  const items = data?.items || [];

  if (isLoading) return <div>Loading...</div>;

  return (
    <QuestionForm
      defaultValues={{
        items: items.map((item) => ({
          id: item.id,
          question: item.question,
          number: item.number,
          answers: item.answer.map((answer) => ({
            id: answer.id,
            text: answer.answer,
            correct: answer.isCorrect,
            number: answer.number,
          })),
        })),
      }}
      lessonId={lessonId}
    />
  );
};

export default Wrapper;
