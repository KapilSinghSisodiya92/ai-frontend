import { z } from "zod";

const IssueSchema = z.object({
  severity: z.enum(["critical", "warning", "suggestion"]),
  line: z.number().nullable(),
  message: z.string(),
  fix: z.string(),
});

export const ReviewSchema = z.object({
  language: z.string(),
  overallScore: z.number().min(1).max(10),
  summary: z.string(),
  issues: z.array(IssueSchema),
  refactoredCode: z.string(),
});

export type Review = z.infer<typeof ReviewSchema>;
export type ReviewIssue = z.infer<typeof IssueSchema>;

export const severityStyles: Record<
  ReviewIssue["severity"],
  string
> = {
  critical: "bg-red-500/10 text-red-400 border-red-500/30 animate-pulse",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/30 animate-pulse",
  suggestion: "bg-blue-500/10 text-blue-400 border-blue-500/30",
};
