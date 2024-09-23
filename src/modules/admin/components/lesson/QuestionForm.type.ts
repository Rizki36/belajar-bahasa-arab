import { z } from "zod";

import { QuestionFormSchema } from "./QuestionForm";

export type QuestionFormSchemaType = z.infer<typeof QuestionFormSchema>;
