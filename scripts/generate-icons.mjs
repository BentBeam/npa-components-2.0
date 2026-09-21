/**
 * Genererar React-komponenter ur ikonernas SVG, exporterade från Figma.
 *
 * Källa: src/icons/svg/<Namn>-<storlek>.svg (hämtade från Figma-bibliotekets
 * ikonsida). Kör `npm run icons:generate` efter att nya SVG:er lagts till.
 *
 * SVG-filerna är sanningen – redigera aldrig den genererade filen för hand.
 */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const SVG_DIR = "src/icons/svg";
const OUT = "src/icons/icons.gen.tsx";

/** Gör om SVG-attribut till JSX-motsvarigheter. */
const toJsx = (markup) =>
  markup
    .replace(/\sid="[^"]*"/g, "")
    .replace(/fill="#1D1D1D"/gi, 'fill="currentColor"')
    .replace(/stroke="#1D1D1D"/gi, 'stroke="currentColor"')
    .replace(/([a-z]+)-([a-z])/g, (m, a, b) =>
      ["fill-rule", "clip-rule", "stroke-width", "stroke-linecap", "stroke-linejoin", "clip-path", "fill-opacity", "stroke-opacity"].includes(m)
        ? `${a}${b.toUpperCase()}`
        : m,
    )
    .trim();

/** Plockar ut allt mellan <svg …> och </svg>. */
const innerOf = (svg) => toJsx(svg.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, ""));

const icons = new Map();
for (const file of readdirSync(SVG_DIR).filter((f) => f.endsWith(".svg")).sort()) {
  const [name, size] = file.replace(".svg", "").split("-");
  const svg = readFileSync(`${SVG_DIR}/${file}`, "utf8");
  const viewBox = svg.match(/viewBox="([^"]+)"/)?.[1] ?? `0 0 ${size} ${size}`;
  if (!icons.has(name)) icons.set(name, new Map());
  icons.get(name).set(Number(size), { viewBox, inner: innerOf(svg) });
}

const body = [...icons.entries()]
  .map(([name, sizes]) => {
    const available = [...sizes.keys()].sort((a, b) => a - b);
    // 20 px är bibliotekets standardstorlek; annars den enda som finns.
    const fallback = available.includes(20) ? 20 : available[available.length - 1];
    const cases = available
      .map((s) => `    ${s}: { viewBox: "${sizes.get(s).viewBox}", children: <>${sizes.get(s).inner}</> },`)
      .join("\n");
    return `const ${name}Variants: Record<number, IconVariant> = {
${cases}
};

/** Ikon ${name}. Storlekar: ${available.join(", ")} px. */
export function Icon${name}({ size = ${fallback}, ...props }: IconProps<${available.join(" | ")}>) {
  return <IconBase variants={${name}Variants} size={size} name="${name}" {...props} />;
}`;
  })
  .join("\n\n");

const file = `/* eslint-disable */
/**
 * GENERERAD FIL – ändra inte för hand.
 * Kör \`npm run icons:generate\` för att bygga om från src/icons/svg/.
 */
import type { ReactNode, SVGProps } from "react";

export interface IconVariant {
  viewBox: string;
  children: ReactNode;
}

export interface IconProps<TSize extends number = number> extends Omit<SVGProps<SVGSVGElement>, "children"> {
  /** Ikonstorlek i pixlar. Endast de storlekar som finns i Figma är tillåtna. */
  size?: TSize;
  /**
   * Tillgänglig etikett. Utan den döljs ikonen för skärmläsare, vilket är rätt
   * när ikonen sitter bredvid en text som redan säger samma sak.
   */
  title?: string;
}

function IconBase({
  variants,
  size,
  name,
  title,
  ...props
}: IconProps & { variants: Record<number, IconVariant>; name: string }) {
  const variant = variants[size as number] ?? variants[Object.keys(variants).map(Number)[0]];
  return (
    <svg
      width={size}
      height={size}
      viewBox={variant.viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      data-icon={name}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {variant.children}
    </svg>
  );
}

${body}
`;

writeFileSync(OUT, file);
console.log(`Genererade ${icons.size} ikoner till ${OUT}`);
