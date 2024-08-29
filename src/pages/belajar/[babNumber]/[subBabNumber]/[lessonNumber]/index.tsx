import { zodResolver } from "@hookform/resolvers/zod";
import { HeartFilledIcon } from "@radix-ui/react-icons";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import { getSession } from "next-auth/react";
import React, { FC, useId, useMemo, useState } from "react";
import { useForm, UseFormReturn, useWatch } from "react-hook-form";
import SuperJSON from "superjson";
import { z } from "zod";

import Button3D from "@/common/components/ui/3d-button";
import { Button } from "@/common/components/ui/button";
import { Form } from "@/common/components/ui/form";
import { Progress } from "@/common/components/ui/progress";
import useSystemSetting from "@/common/hooks/useSystemSetting";
import { cn } from "@/common/utils";
import ShareSection from "@/modules/client/components/belajar/ShareSection";
import EndModal from "@/modules/client/components/lesson/EndModal";
import useStudent from "@/modules/client/hooks/useStudent";
import { NextPageWithLayout } from "@/pages/_app";
import { createContextInner } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { RouterOutput, trpc } from "@/utils/trpc";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{
    babNumber: string;
    subBabNumber: string;
    lessonNumber: string;
  }>
) {
  const session = await getSession(context);

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: await createContextInner({ session }),
    transformer: SuperJSON,
  });

  const babNumber = Number(context.params?.babNumber);
  const subBabNumber = Number(context.params?.subBabNumber);
  const lessonNumber = Number(context.params?.lessonNumber);

  /*
   * Prefetching the `post.byId` query.
   * `prefetch` does not return the result and never throws - if you need that behavior, use `fetch` instead.
   */
  const result = await helpers.student.lesson.data
    .fetch({
      babNumber,
      subBabNumber,
      lessonNumber,
    })
    .catch((err) => {
      console.log(err);
    });

  if (!result || !result?.lesson) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      trpcState: helpers.dehydrate(),
      bab: result.bab,
      subBab: result.subBab,
      lesson: result.lesson,
    },
  };
}

type Questions = RouterOutput["student"]["lesson"]["listQuestion"]["questions"];

export const FormSchema = z.object({
  answer: z.string(),
  isIncorrect: z.boolean().optional(),
});

type Form = UseFormReturn<z.infer<typeof FormSchema>>;

const maxHeartCount = 3;

const LessonPage: NextPageWithLayout<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ bab, subBab, lesson }) => {
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

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const { data: questionList, isLoading: loadingQuestions } =
    trpc.student.lesson.listQuestion.useQuery({
      lessonId: lesson.id,
    });
  const { mutate: checkAnswer } = trpc.student.lesson.checkAnswer.useMutation();
  const { mutate: submit } = trpc.student.lesson.submit.useMutation();
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

  // TODO: handle loading state
  if (loadingQuestions || loadingConfig) return <div></div>;

  const question = questions[questionIndex];
  const questionText = question?.question ?? "";
  const answers = question?.answer ?? [];

  const endLesson = (heart: number) => {
    submit(
      {
        studentId: student?.id ?? "",
        lessonId: lesson.id,
        heartCount: heart,
        answers: myAnswers,
      },
      {
        onSuccess: (data) => {
          setIsEnd(true);
          setScore(data.score);
          setStar(data.star);
        },
        onError: (error) => {
          console.error(error);
        },
      }
    );
  };

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    checkAnswer(
      {
        questionId: question.id,
        answerId: data.answer,
      },
      {
        onSuccess: (result) => {
          const isLastQuestion = questionIndex === questions.length - 1;

          if (result.isCorrect) {
            if (isLastQuestion) void endLesson(heartCount);
            setQuestionIndex((prev) => prev + 1);
            form.reset();
          } else {
            form.setValue("isIncorrect", true);
            setHeartCount((prev) => prev - 1);
            if (heartCount === 1) void endLesson(heartCount - 1);
          }
        },
        onError: (error) => {
          console.error(error);
        },
        onSettled: () => {
          setMyAnswers((prev) => [
            ...prev,
            {
              questionId: question.id,
              answerId: data.answer,
            },
          ]);
        },
      }
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
      <div className="bg-primary min-h-screen overflow-y-auto px-11">
        <div className="mt-6 mb-3 flex items-center justify-between">
          <Link href="/belajar">
            <Button variant="ghost" className="text-white">
              Keluar
            </Button>
          </Link>
          <div className="flex items-center text-white gap-x-2 text-lg">
            {heartCount} <HeartFilledIcon className="text-white size-6" />
          </div>
        </div>
        <div className="grid gap-y-5 xl:grid-cols-[700px,1fr] gap-x-12 mb-6">
          <div className="flex flex-col-reverse xl:flex-col">
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
            <div className="group flex-col-reverse xl:flex-col items-center flex justify-center mt-3">
              <Progress
                value={(questionIndex / questions.length) * 100}
                variant="white"
                className="w-full transition duration-300 group-hover:opacity-100 opacity-50 mb-2"
              />
              <div className="flex justify-between w-full transition duration-300 text-white/50 group-hover:text-white">
                <div>
                  Bab {bab.number} - Unit {subBab.number}
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
                  <Answer key={answer.id} answer={answer} form={form} />
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
                />
              </div>
            </form>
          </Form>
        </div>
      </div>
    </>
  );
};

const AnswerButton: FC<{
  form: Form;
  onContinue: () => void;
}> = ({ onContinue, form }) => {
  const answer = useWatch({
    control: form.control,
    name: "answer",
  });
  const isIncorrect = useWatch({
    control: form.control,
    name: "isIncorrect",
  });

  return (
    <>
      {isIncorrect ? (
        <>
          <Button3D
            type="button"
            variant="destructive"
            className="w-full"
            frontClassName="!py-8 text-lg font-semibold"
            onClick={() => {
              onContinue();
            }}
          >
            Lanjut
          </Button3D>
          <div className="text-white text-center mt-3">Jawaban Anda salah.</div>
        </>
      ) : (
        <Button3D
          type="submit"
          variant="white"
          className="w-full"
          frontClassName="!py-8 text-lg font-semibold"
          disabled={!answer}
        >
          Jawab
        </Button3D>
      )}
    </>
  );
};

const Answer: FC<{
  answer: Questions[number]["answer"][number];
  form: Form;
}> = ({ answer, form }) => {
  const id = useId();
  const isIncorrect = useWatch({
    control: form.control,
    name: "isIncorrect",
  });

  return (
    <div className="relative">
      <input
        {...form.register("answer")}
        type="radio"
        className="peer hidden"
        id={id}
        value={answer?.id}
        disabled={isIncorrect}
      />
      <label
        htmlFor={id}
        className={cn(
          "flex select-none text-xl text-white font-semibold transition duration-200 bg-primary shadow-lg items-center justify-center cursor-pointer min-h-24 flex-col rounded-lg border-2 border-white p-4 hover:shadow-lg",
          "peer-checked:border-2 peer-checked:bg-white peer-checked:text-black peer-disabled:cursor-not-allowed"
        )}
      >
        {answer?.answer ?? ""}
      </label>
    </div>
  );
};

LessonPage.getLayout = (page) => {
  return page;
};

export default LessonPage;
