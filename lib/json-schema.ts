import { z } from "zod";

export const SEMANTIC_TYPES = [
  "id",
  "timestamp",
  "amount",
  "name",
  "url",
  "email",
  "boolean-flag",
  "other",
] as const;

export type SemanticType = (typeof SEMANTIC_TYPES)[number];

const FieldExplanationSchema = z.object({
  path: z.string(),
  type: z.string(),
  purpose: z.string(),
  example: z.string(),
  isRequired: z.boolean(),
  semanticType: z.enum(SEMANTIC_TYPES),
});

export const JSONAnalysisSchema = z.object({
  summary: z.string(),
  fields: z.array(FieldExplanationSchema),
  typescriptInterface: z.string(),
  apiPurpose: z.string(),
});

export type FieldExplanation = z.infer<typeof FieldExplanationSchema>;
export type JSONAnalysis = z.infer<typeof JSONAnalysisSchema>;

export const semanticTypeStyles: Record<SemanticType, string> = {
  id: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  timestamp: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
  amount: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  name: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  url: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
  email: "bg-rose-500/10 text-rose-400 border-rose-500/30",
  "boolean-flag": "bg-amber-500/10 text-amber-400 border-amber-500/30",
  other: "bg-gray-500/10 text-gray-400 border-gray-500/30",
};

export const semanticTypeLabels: Record<SemanticType, string> = {
  id: "ID",
  timestamp: "Timestamp",
  amount: "Amount",
  name: "Name",
  url: "URL",
  email: "Email",
  "boolean-flag": "Flag",
  other: "Other",
};

export type FieldTreeNode = {
  name: string;
  fullPath: string;
  children: FieldTreeNode[];
  field?: FieldExplanation;
};

export function buildFieldTree(fields: FieldExplanation[]): FieldTreeNode[] {
  const root: FieldTreeNode = {
    name: "root",
    fullPath: "",
    children: [],
  };

  const nodeMap = new Map<string, FieldTreeNode>([["", root]]);

  for (const field of fields) {
    const parts = field.path.split(".");
    let pathSoFar = "";

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      const parentPath = pathSoFar;
      pathSoFar = pathSoFar ? `${pathSoFar}.${part}` : part;

      if (!nodeMap.has(pathSoFar)) {
        const node: FieldTreeNode = {
          name: part,
          fullPath: pathSoFar,
          children: [],
        };
        nodeMap.set(pathSoFar, node);
        nodeMap.get(parentPath)!.children.push(node);
      }

      if (i === parts.length - 1) {
        nodeMap.get(pathSoFar)!.field = field;
      }
    }
  }

  return root.children;
}
