import { z } from "zod";

import { QuestionFormSchema } from "./QuestionForm.schema";

export type QuestionFormSchemaType = z.infer<typeof QuestionFormSchema>;
