import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
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

const FormSchema = z.object({
  number: z
    .number({
      message: "Nomor pelajaran harus berupa angka",
    })
    .min(1, {
      message: "Nomor pelajaran minimal 1",
    }),
});

const LessonForm: React.FC<{
  defaultValues?: z.infer<typeof FormSchema>;
  onSubmit: (data: z.infer<typeof FormSchema>) => void;
}> = ({ defaultValues, onSubmit }) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Isi dengan angka minimal 1"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Ini adalah nomor pelajaran yang nanatinya akan digunakan untuk
                urutan pelajaran
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default LessonForm;
