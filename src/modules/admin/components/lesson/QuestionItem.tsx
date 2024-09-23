import { InfoCircledIcon } from "@radix-ui/react-icons";
import React from "react";
import { Control, useFieldArray, UseFieldArrayRemove } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import { Button } from "@/common/components/ui/button";
import { Checkbox } from "@/common/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/common/components/ui/form";
import { Input } from "@/common/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/common/components/ui/tooltip";

import { QuestionFormSchemaType } from "./QuestionForm.type";

const QuestionItem = ({
  questionIndex,
  control,
  remove,
  score,
}: {
  questionIndex: number;
  control: Control<QuestionFormSchemaType>;
  remove: UseFieldArrayRemove;
  score: number;
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
        <div className="flex gap-x-3">
          <FormField
            control={control}
            name={`items.${questionIndex}.question`}
            render={({ field }) => (
              <FormItem className="flex-1">
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

          <FormItem>
            <FormLabel>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger type="button">
                    Nilai
                    <InfoCircledIcon className="inline-block ml-1 -translate-y-0.5" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Ubah di pengaturan</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="Isi dengan nilai"
                value={score}
                onClick={() => {
                  window.open(`/admin/setting`, "_blank");
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </div>

        <hr className="my-4" />

        <div className="flex justify-between items-center mb-3">
          <div className="text-sm">Jawaban</div>
          <Button
            type="button"
            size="sm"
            onClick={() => {
              const lastAnswer = fields[fields.length - 1];

              appendAnswer({
                id: uuidv4(),
                text: "",
                correct: false,
                number: lastAnswer ? lastAnswer.number + 1 : 1,
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

export default QuestionItem;
