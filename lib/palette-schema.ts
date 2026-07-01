import { z } from "zod";

const hexColor = z.string().regex(/^#[0-9A-Fa-f]{6}$/);

export const ColorScaleSchema = z.object({
  50: hexColor,
  100: hexColor,
  200: hexColor,
  300: hexColor,
  400: hexColor,
  500: hexColor,
  600: hexColor,
  700: hexColor,
  800: hexColor,
  900: hexColor,
});

export const PaletteSchema = z.object({
  brandName: z.string(),
  primary: ColorScaleSchema,
  secondary: ColorScaleSchema,
  accent: ColorScaleSchema,
  neutral: ColorScaleSchema,
  success: ColorScaleSchema,
  warning: ColorScaleSchema,
  danger: ColorScaleSchema,
  tailwindConfig: z.string(),
});

export type ColorScale = z.infer<typeof ColorScaleSchema>;
export type Palette = z.infer<typeof PaletteSchema>;

export const SCALE_STEPS = [
  50, 100, 200, 300, 400, 500, 600, 700, 800, 900,
] as const;

export function paletteToCssVars(palette: Palette): Record<string, string> {
  return {
    "--color-primary": palette.primary[500],
    "--color-primary-hover": palette.primary[600],
    "--color-primary-light": palette.primary[100],
    "--color-primary-dark": palette.primary[900],
    "--color-secondary": palette.secondary[500],
    "--color-secondary-light": palette.secondary[100],
    "--color-accent": palette.accent[500],
    "--color-neutral-bg": palette.neutral[50],
    "--color-neutral-border": palette.neutral[200],
    "--color-neutral-text": palette.neutral[800],
    "--color-neutral-muted": palette.neutral[500],
    "--color-success": palette.success[500],
    "--color-success-light": palette.success[100],
    "--color-warning": palette.warning[500],
    "--color-warning-light": palette.warning[100],
    "--color-danger": palette.danger[500],
    "--color-danger-light": palette.danger[100],
  };
}
