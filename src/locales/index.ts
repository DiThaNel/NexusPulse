import { es } from "./es";
import { en } from "./en";

export type Locale = "es" | "en";
export type Dictionary = typeof es;

export const dictionaries: Record<Locale, Dictionary> = {
  es,
  en,
};

export const defaultLocale: Locale = "es";
