# NPA Logistik Designsystem 2.0

React- och Tailwind-komponenter genererade från NPA:s Figma-bibliotek
[Design system WIP](https://www.figma.com/design/jMxylLvF8eQlhbRLUUjgaP/Design-system-WIP).

Paketnamn: `@npa-eval/components2.0`

## Kom igång

```bash
npm install
npm run storybook        # Storybook på http://localhost:6007
```

## Kommandon

| Kommando | Gör |
| --- | --- |
| `npm run storybook` | Kör Storybook |
| `npm run build` | Bygger npm-paketet till `dist/` |
| `npm run icons:generate` | Genererar om ikonkomponenterna från `src/icons/svg/` |
| `npm run typecheck` | TypeScript utan att skriva filer |
| `npm run release` | Bygger och packar en `.tgz` — publicerar inte |
| `npm run release -- --minor --publish` | Höjer version, bygger och publicerar till npm |
| `npm run figma:validate` | Torrkör Code Connect |
| `npm run figma:publish` | Publicerar Code Connect till Figma |

Paketet byggs **aldrig automatiskt** vid komponentändringar. Biblioteket är work in progress —
ändringar syns direkt i Storybook, men npm-paketet uppdateras bara när `npm run release` körs.

## Struktur

```
src/
  styles/       tokens.css (Figmas variabler), Tailwind-tema, @font-face, global.css
  fonts/        Cocogoose Pro (woff2) + licens
  icons/        svg/ = export från Figma, icons.gen.tsx = genererade komponenter
  foundations/  Storybook-sidor för färger, typografi, spacing, grid, ikoner
  components/   en mapp per komponent
  docs/         Kom igång-sidorna
scripts/
  generate-icons.mjs
  release.mjs
```

## Typsnitt och licens

Cocogoose Pro är ett kommersiellt typsnitt från Zetafonts. woff2-filerna ligger i `src/fonts/` och
distribueras med npm-paketet. Licensdokumentet ligger medvetet utanför repot eftersom repot är
publikt — se `src/fonts/LICENS.md`. Eftersom paketet publiceras publikt blir fontfilerna öppet
nedladdningsbara; kontrollera att licensen tillåter det innan första publicering.

## Status

Foundation är klar. Komponenterna byggs i omgångar. Dessa sidor i Figma är fortfarande tomma och har
därför ingen kod: Pagination, Feedback & Alerts, Data Display, Badges & Tags, Overlays,
Avatar & User, Menus.
