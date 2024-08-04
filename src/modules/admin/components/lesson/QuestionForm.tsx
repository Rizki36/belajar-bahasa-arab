import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import {
  Control,
  useFieldArray,
  UseFieldArrayRemove,
  useForm,
} from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";

import { Button } from "@/common/components/ui/button";
import { Checkbox } from "@/common/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/common/components/ui/form";
import { Input } from "@/common/components/ui/input";
import { useToast } from "@/common/components/ui/use-toast";
import { trpc } from "@/utils/trpc";

const FormSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().uuid(),
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
          text: z.string().min(1, {
            message: "Jawaban tidak boleh kosong",
          }),
          correct: z.boolean(),
        })
      ),
    })
  ),
});

const QuestionItem = ({
  questionIndex,
  control,
  remove,
}: {
  questionIndex: number;
  control: Control<z.infer<typeof FormSchema>>;
  remove: UseFieldArrayRemove;
}) => {
  const {
    fields,
    append: appendAnswer,
    remove: removeAnswer,
  } = useFieldArray({
    control: control,
    name: `items.${questionIndex}.answers`,
  });

  return (
    <div className="flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all">
      <div className="flex items-center justify-between w-full">
        <div className="text-sm">Soal {questionIndex + 1}</div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            remove(questionIndex);
          }}
        >
          Hapus
        </Button>
      </div>
      <div className="w-full">
        <FormField
          control={control}
          name={`items.${questionIndex}.question`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pertanyaan</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Isi dengan pertanyaan"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <hr className="my-4" />

        <div className="flex justify-between items-center mb-3">
          <div className="text-sm">Jawaban</div>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              appendAnswer({
                id: uuidv4(),
                text: "",
                correct: false,
              });
            }}
          >
            Tambah jawaban
          </Button>
        </div>

        <div className="space-y-2 w-full">
          {fields.map((question, answerIndex) => {
            return (
              <div key={question.id} className="flex gap-2 w-full">
                <Button
                  type="button"
                  asChild
                  variant="ghost"
                  className="space-x-3"
                >
                  <label
                    htmlFor={`items.${questionIndex}.answers.${answerIndex}.correct`}
                    className="flex items-center space-x-2"
                  >
                    <FormField
                      control={control}
                      name={`items.${questionIndex}.answers.${answerIndex}.correct`}
                      render={({ field }) => (
                        <Checkbox
                          id={`items.${questionIndex}.answers.${answerIndex}.correct`}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mr-2"
                        />
                      )}
                    />
                    Benar
                  </label>
                </Button>
                <FormField
                  control={control}
                  name={`items.${questionIndex}.answers.${answerIndex}.text`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Isi dengan jawaban"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    console.log("remove", answerIndex);
                    removeAnswer(answerIndex);
                  }}
                >
                  Hapus
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const QuestionForm: React.FC<{
  lessonId: string;
  defaultValues?: z.infer<typeof FormSchema>;
}> = ({ lessonId, defaultValues }) => {
  const { toast } = useToast();
  const { mutateAsync } = trpc.question.bulk.useMutation();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
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

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await mutateAsync({
        lessonId,
        items: data.items.map((item) => ({
          id: item.id,
          number: 1,
          score: 1,
          question: item.question,
          answers: item.answers.map((answer) => ({
            id: answer.id,
            text: answer.text,
            correct: answer.correct,
          })),
        })),
      });
      toast({
        title: "Berhasil menyimpan soal",
        description: "Soal berhasil disimpan.",
      });
    } catch (error) {
      toast({
        title: "Gagal menyimpan soal",
        description:
          "Terjadi kesalahan saat menyimpan soal. Silahkan coba lagi.",
      });
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="text-xl mb-4 flex justify-between items-center">
          <h2>List Soal</h2>
          <div>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                appendItem({
                  id: uuidv4(),
                  question: "",
                  answers: [
                    {
                      id: uuidv4(),
                      text: "",
                      correct: true,
                    },
                    {
                      id: uuidv4(),
                      text: "",
                      correct: false,
                    },
                    {
                      id: uuidv4(),
                      text: "",
                      correct: false,
                    },
                    {
                      id: uuidv4(),
                      text: "",
                      correct: false,
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
  const { data, isLoading } = trpc.question.list.useQuery({
    lessonId,
    with: ["answers"],
  });

  const items = data?.items || [];

  if (isLoading) return <div>Loading...</div>;

  return (
    <QuestionForm
      defaultValues={{
        items: items.map((item) => ({
          id: item.id,
          question: item.question,
          answers: item.answer.map((answer) => ({
            id: answer.id,
            text: answer.answer,
            correct: answer.isCorrect,
          })),
        })),
      }}
      lessonId={lessonId}
    />
  );
};

export default Wrapper;
