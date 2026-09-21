# NPA Logistik Designsystem 2.0

Komponentbibliotek i React + Tailwind v4, genererat från Figma-filen **Design system WIP**
(`jMxylLvF8eQlhbRLUUjgaP`). Paketnamn `@npa-eval/components2.0`. Allt skrivs på **svenska** —
designern som läser Storybook är inte programmerare.

## Grundregler

**Figma är sanningen.** Koden får inte innehålla varianter som saknas i Figma. Behövs något som inte
finns i designen: lägg till det i Figma först, bygg sedan.

**Inga lösa värden.** Ingen hexkod, ingen pixelsiffra i en komponent. Allt går via tokens i
`src/styles/tokens.css`, som speglar Figmas variabler exakt.

**Ingen CSS per komponent.** Bara Tailwind-klasser.

**Paketet byggs på kommando.** Kör aldrig `npm run release` av eget initiativ.

## Stack

Storybook 10 (port 6007), React 19, Vite, TypeScript, Tailwind v4 via `@tailwindcss/vite`,
`@figma/code-connect` 2.x.

`src/styles/global.css` styr ordningen: fonts → tokens → tailwindcss → `@source "../"` → tema.
`@source` krävs explicit; utan den hittar Tailwind inte `.tsx`-filerna och genererar klasserna tyst
inte alls.

## Tokens

- Färger: `--npa-<grupp>-<namn>`, t.ex. `--npa-action-primary-background`. Tailwind:
  `bg-action-primary`, `text-text-secondary`, `border-border-strong`.
- Spacing: `p-1`…`p-12` = `spacing/1`…`spacing/12` (4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96 px).
  Detta är **inte** Tailwinds standardskala.
- Text: `text-h1`…`text-h4`, `text-body`, `text-ui`, `text-small`.
- Vikter: `font-light` (300), `font-semilight` (350), `font-darkmode` (370). Namnen kommer från
  Zetafonts och har inget med mörkt läge att göra.

## Att bygga en komponent

Mapp per komponent under `src/components/<Namn>/` med `<Namn>.tsx`, `<Namn>.stories.tsx`,
`<Namn>.figma.ts` och `index.ts`. Exportera från `src/index.ts`.

Stories-titel: `Komponenter/<Namn>`. Kontrollerade komponenter behöver `useArgs` från
`storybook/preview-api` i en `render` i metan, annars går de inte att interagera med.

Code Connect skrivs i template-format (`export default { id, imports, example }`), aldrig
`figma.connect()` — parsern togs bort i CLI 2.0. Publicera alltid med `--label React`; utan flaggan
hamnar template-filer under label `Code` och skapar en parallell uppsättning.

## Ikoner

`src/icons/svg/` innehåller SVG:er exporterade ur Figma. `src/icons/icons.gen.tsx` är **genererad** —
redigera den aldrig för hand, kör `npm run icons:generate`. Ikonerna bygger på Bootstrap Icons, som
ligger som devDependency för att lägga till fler.

## Tailwind-fallgrop

Två utility-klasser för samma CSS-egenskap på samma element: ordningen i markupen avgör ingenting —
det är ordningen i den genererade stilmallen som gäller. Villkora klassen i stället för att lita på
att den sista vinner.

## WIP-märkning i Figma

Biblioteket är under uppbyggnad. Grundregeln är **opt-out**: allt som är en riktig Figma-komponent
byggs, utom det som är märkt.

**Märk med prefixet `[WIP]`.** Det fungerar på fyra nivåer och ärvs nedåt:

| Nivå | Exempel | Betyder |
| --- | --- | --- |
| Sida | `[WIP] Overlays` | Hela sidan hoppas över |
| Sektion | `[WIP] Utforskande` | Allt i sektionen hoppas över |
| Komponent | `[WIP] Expander Button` | Komponenten hoppas över |
| Variantset | `[WIP] Time Picker` | Hela variantsetet hoppas över |

Inget annat behöver märkas. Det som redan filtreras bort automatiskt:

- **Dokumentation.** Page Header-ramar, beskrivningstexter och etikettkolumner är vanliga ramar,
  inte komponenter, och plockas aldrig upp som byggbara.
- **Tomma sidor.** Saknas innehåll finns inget att bygga.
- **Gömda lager.** Används som av-läge för booleans (`Has Icon` på Button), aldrig som statusmarkör.

Statusen får **inte** ligga i komponentens beskrivningsfält — det fältet syns inte via MCP:n.
Beskrivningarna i filen är textlager bredvid komponenterna, och de läses som dokumentation, inte
som status.

**Ofullständiga komponenter är inte samma sak som WIP.** Att Button saknar fokustillstånd är en
lucka jag rapporterar, inte något du behöver märka. Märk bara det som inte ska byggas alls än.

**Säkerhetsnät:** innan varje omgång listas vad som bedömts som byggbart, för godkännande. Det
fångar komponenter där märkningen glömts.

## Öppna frågor

- Radius-tokens saknas i Figma. Komponenternas hörnradier läses per komponent tills det finns en
  variabelsamling för radius.
- Skuggor finns inte som stilar i filen.
- Swatchen `Form/Input Border Hover` på Colors-sidan är bunden till variabeln `Form/Input Border`
  (#afafaf) och inte till någon egen hover-variabel. Koden använder #afafaf, som komponenterna gör.
