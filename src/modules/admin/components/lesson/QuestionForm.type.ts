import type { z } from "zod";

import type { QuestionFormSchema } from "./QuestionForm.schema";

export type QuestionFormSchemaType = z.infer<typeof QuestionFormSchema>;
