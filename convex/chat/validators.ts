import { z } from "zod";


export const gatherRelevantResourceSchema = z.object({
    query: z.string(),
})