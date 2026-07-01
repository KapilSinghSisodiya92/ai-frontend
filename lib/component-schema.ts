import { z } from "zod";

export const ComponentSchema = z.object({
  componentName: z.string(),
  jsx: z.string(),
  tailwindClasses: z.array(z.string()),
  accessibilityNotes: z.string(),
  propsInterface: z.string(),
});

export type GeneratedComponent = z.infer<typeof ComponentSchema>;

export type CanvasComponentType = "button" | "input" | "card";

export const COMPONENT_TYPES: CanvasComponentType[] = [
  "button",
  "input",
  "card",
];

export const COMPONENT_LABELS: Record<CanvasComponentType, string> = {
  button: "Button",
  input: "Input",
  card: "Card",
};

export type CanvasItem = {
  id: string;
  x: number;
  y: number;
  type: CanvasComponentType;
  generated?: GeneratedComponent;
  generating?: boolean;
};
