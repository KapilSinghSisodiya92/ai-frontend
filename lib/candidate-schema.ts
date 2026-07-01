import { z } from "zod";

export const CandidateSchema = z.object({
  name: z.string(),
  currentTitle: z.string(),
  yearsExp: z.number(),
  skills: z.array(
    z.object({
      name: z.string(),
      years: z.number(),
    })
  ),
  isRemote: z.boolean(),
  salary: z.string().nullable(),
  summary: z.string().max(200),
  fitScore: z.number().min(1).max(10),
});

export type Candidate = z.infer<typeof CandidateSchema>;

export function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
