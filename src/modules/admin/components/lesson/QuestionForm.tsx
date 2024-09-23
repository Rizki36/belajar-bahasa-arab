import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { Button } from "@/common/components/ui/button";
import { Form } from "@/common/components/ui/form";
import useSystemSetting from "@/common/hooks/useSystemSetting";
import { trpc } from "@/utils/trpc";

import { formatQuestionFormPayload } from "../../utils/formatter";
import QuestionItem from "./QuestionItem";

export const QuestionFormSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
      number: z.number().min(1),
      question: z
        .string({
          message: "Pertanyaan harus berupa teks",
        })
        .min(1, {
          message: "Pertanyaan tidak boleh kosong",
        }),
      answers: z.array(
        z.object({
          id: z.string().uuid(),
          number: z.number().min(1),
          text: z.string().min(1, {
            message: "Jawaban tidak boleh kosong",
          }),
          correct: z.boolean(),
        })
      ),
    })
  ),
});

const QuestionForm: React.FC<{
  lessonId: string;
  defaultValues?: z.infer<typeof QuestionFormSchema>;
}> = ({ lessonId, defaultValues }) => {
  const trpcUtils = trpc.useUtils();
  const { config } = useSystemSetting();

  const { mutateAsync } = trpc.admin.question.bulk.useMutation();
  const form = useForm<z.infer<typeof QuestionFormSchema>>({
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

  const onSubmit = async (data: z.infer<typeof QuestionFormSchema>) => {
    console.log(
      formatQuestionFormPayload(defaultValues?.items || [], data.items || [])
    );

    return;
    try {
      await mutateAsync({
        lessonId,
        items: data.items.map((item, questionIndex) => ({
          id: item.id,
          number: questionIndex + 1,
          question: item.question,
          answers: item.answers.map((answer, answerIndex) => ({
            id: answer.id,
            number: answerIndex + 1,
            text: answer.text,
            correct: answer.correct,
          })),
        })),
      });
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
          <Button type="submit">Simpan</Button>
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
