import { z } from "zod";

export const AltTextSchema = z.object({
  altText: z.string().max(125),
  description: z.string(),
  objects: z.array(z.string()),
  isDecorative: z.boolean(),
});

export type AltTextResult = z.infer<typeof AltTextSchema>;
