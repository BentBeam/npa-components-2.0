/**
 * Genererar src/styles/safelist.css.
 *
 * Tailwind genererar bara de klasser den ser användas. En konsument som skriver
 * `bg-action-primary` i sin egen prototyp får därför ingenting ur vårt
 * färdigbyggda styles.css. Den här filen tvingar fram varje klass som hör till
 * en token, så att alla tokens går att använda direkt.
 */
import { readFileSync, writeFileSync } from "node:fs";

const theme = readFileSync("src/styles/tailwind-theme.css", "utf8");
const namesFor = (prefix) => [
  ...new Set([...theme.matchAll(new RegExp(`--${prefix}-([a-z0-9-]+):`, "g"))].map((m) => m[1])),
];

const colors = namesFor("color");
const spacing = namesFor("spacing");
const texts = namesFor("text").filter((n) => !n.includes("--"));
const weights = namesFor("font-weight");

const group = (values) => `{${values.join(",")}}`;

const lines = [
  `@source inline("${group(["bg", "text", "border", "fill", "stroke", "ring", "decoration", "outline", "divide", "caret", "accent"])}-${group(colors)}");`,
  `@source inline("hover:${group(["bg", "text", "border"])}-${group(colors)}");`,
  `@source inline("focus:${group(["bg", "text", "border", "ring"])}-${group(colors)}");`,
  `@source inline("${group(["p", "px", "py", "pt", "pr", "pb", "pl", "m", "mx", "my", "mt", "mr", "mb", "ml", "gap", "gap-x", "gap-y", "space-x", "space-y", "w", "h", "min-w", "min-h", "top", "right", "bottom", "left", "inset"])}-${group(spacing)}");`,
  `@source inline("text-${group(texts)}");`,
  `@source inline("font-${group(weights)}");`,
];

writeFileSync(
  "src/styles/safelist.css",
  `/**
 * GENERERAD FIL – ändra inte för hand.
 * Kör \`node scripts/generate-safelist.mjs\` för att bygga om.
 *
 * Tvingar Tailwind att generera alla token-baserade klasser, även de vi själva
 * inte använder, så att konsumenter kan använda dem i sina prototyper.
 */

${lines.join("\n")}
`,
);

console.log(`Safelist: ${colors.length} färger, ${spacing.length} spacing-steg, ${texts.length} textstorlekar, ${weights.length} vikter`);
