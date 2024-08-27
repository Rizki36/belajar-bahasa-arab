import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/common/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/common/components/ui/form";
import { Input } from "@/common/components/ui/input";
import { Switch } from "@/common/components/ui/switch";
import useSystemSetting from "@/common/hooks/useSystemSetting";
import AdminMainLayout from "@/modules/admin/layouts/MainLayout";
import { NextPageWithLayout } from "@/pages/_app";
import { trpc } from "@/utils/trpc";

const FormSchema = z.object({
  randomizeQuestion: z.boolean().default(false),
  randomizeAnswer: z.boolean().default(false),
  defaultScore: z.coerce.number().default(15),
});

type SettingFormValues = z.infer<typeof FormSchema>;

const SettingPage: NextPageWithLayout = () => {
  const { config, loading } = useSystemSetting();

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold">Pengaturan</h1>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <SettingForm
          defaultValues={{
            randomizeQuestion: config.randomizeQuestion,
            randomizeAnswer: config.randomizeAnswer,
            defaultScore: config.defaultScore,
          }}
        />
      )}
    </div>
  );
};

const SettingForm: React.FC<{
  defaultValues: SettingFormValues;
}> = ({ defaultValues }) => {
  const trpcUtils = trpc.useUtils();
  const { mutateAsync } = trpc.admin.setting.upsert.useMutation();
  const form = useForm<SettingFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });

  const onSubmit = async (data: SettingFormValues) => {
    try {
      toast.success("Berhasil menyimpan pengaturan");
      await mutateAsync({
        items: [
          {
            name: "randomizeQuestion",
            value: data.randomizeQuestion.toString(),
          },
          { name: "randomizeAnswer", value: data.randomizeAnswer.toString() },
          { name: "defaultScore", value: data.defaultScore.toString() },
        ],
      });
      trpcUtils.admin.setting.invalidate();
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan");
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 lg:w-1/2"
      >
        <FormField
          control={form.control}
          name="randomizeQuestion"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Acak pertanyaan</FormLabel>
                <FormDescription>
                  Aktifkan fitur ini untuk mengacak pertanyaan
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="randomizeAnswer"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Acak jawaban</FormLabel>
                <FormDescription>
                  Aktifkan fitur ini untuk mengacak jawaban
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="defaultScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nilai default</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Isi dengan angka minimal 1"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Ini adalah nilai default yang akan diberikan kepada siswa jika
                berhasil menjawab soal
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-4">
          <Button type="submit">Simpan</Button>
        </div>
      </form>
    </Form>
  );
};

SettingPage.getLayout = (page) => {
  return <AdminMainLayout>{page}</AdminMainLayout>;
};

export default SettingPage;
