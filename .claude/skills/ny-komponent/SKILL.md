---
name: ny-komponent
description: Bygger en komponent från Figma-filen Design system WIP till färdig pull request i npa-components-2.0. Använd när någon vill bygga, lägga till eller uppdatera en komponent från Figma – t.ex. "bygg Checkbox", "lägg till Alert från Figma", "uppdatera Button mot designen".
---

# Bygg en komponent från Figma

Den här skillen är körschemat. `CLAUDE.md` i repo-roten är reglerna. Läs den först
om den inte redan finns i kontexten – särskilt avsnitten om tokens och WIP-märkning.

Stegen körs i ordning. Hoppa inte över steg 2: det är den enda punkt där en
människa ser vad som ska byggas innan det byggs.

## 1. Läs komponenten i Figma

Figma-filen är `Design system WIP`, key `jMxylLvF8eQlhbRLUUjgaP`.

- `get_metadata` för att hitta noden om du bara har ett namn.
- `get_design_context` för uppbyggnaden.
- `get_variable_defs` för vilka variabler komponenten binder.
- `get_screenshot` som facit att jämföra mot i steg 6.

Notera nod-id:t. Det behövs i Code Connect i steg 5.

Är komponenten – eller dess sida, sektion eller variantset – prefixad `[WIP]`
ska den inte byggas. Säg det och stanna.

## 2. Lista vad som ska byggas och vänta på OK

Skriv, innan en rad kod:

- komponentens namn och nod-id
- varje variant och state i Figma, och vilken prop den blir
- vilka tokens komponenten binder
- vad som saknas i Figma och som du därför **inte** bygger

Vänta på godkännande. Bygg inte vidare på ett antagande om något är oklart –
fråga i stället. Det här steget finns för att opt-out-regeln för WIP är den
känsligare av de två riktningarna: allt obemärkt byggs, alltså måste någon se
listan.

## 3. Bygg komponenten

En mapp, fyra filer:

```
src/components/<Namn>/
  <Namn>.tsx          komponenten
  <Namn>.stories.tsx  en story per variant i Figma
  <Namn>.figma.ts     Code Connect
  index.ts            re-export
```

- Härma den befintliga komponent som CLAUDE.md pekar ut som referens. Följ dess
  filstruktur, propsnamn, ordning på klasser och kommentarsstil. Finns ingen
  referens än blir den här komponenten det – bygg den därefter.
- Bara Tailwind-klasser. Ingen `.css`-fil per komponent.
- Inga hexkoder, inga pixelsiffror. Allt via tokens. `npm run check:komponenter`
  fäller det annars.
- Inga varianter som saknas i Figma, hur rimliga de än verkar. Saknas något:
  rapportera det i steg 7, bygg det inte.
- Exportera från `src/index.ts`. Utan den raden syns komponenten inte för
  konsumenten, och kontrollen fäller den.

## 4. Skriv stories

Titel `Komponenter/<Namn>`, på svenska. En story per variant som finns i Figma,
plus en översiktsstory som visar alla bredvid varandra.

Kontrollerade komponenter måste använda `useArgs` från `storybook/preview-api` i
en `render` i metan – annars går de inte att klicka i eller skriva i, och
designgranskningen i steg 8 blir meningslös.

## 5. Koppla Code Connect

Template-format, aldrig `figma.connect()`:

```ts
import figma from "@figma/code-connect";

export default {
  id: "<nod-id från steg 1>",
  imports: ["import { Namn } from '@npa-eval/components2.0'"],
  example: figma.code`<Namn variant="primary">Etikett</Namn>`,
};
```

Validera med `npm run figma:validate`. **Publicera inte** – det sker samlat när
en omgång är godkänd, med `npm run figma:publish`.

## 6. Jämför mot Figma

Starta Storybook och titta på komponenten bredvid skärmbilden från steg 1.
Kontrollera varje state, inte bara grundläget. Rätta det som skiljer.

## 7. Kör kontrollerna

```bash
npm run check
```

Typer, lint och husregler. Allt ska vara grönt innan PR. Rätta det som fälls –
lämna aldrig över ett rött bygge till granskaren.

## 8. Öppna en pull request

Aldrig direkt till `main`. Egen gren, namn `komponent/<namn-i-gemener>`.

PR-beskrivningen skrivs för en designer som inte läser kod. Den ska innehålla:

- vilken komponent och vilket nod-id i Figma
- vilka varianter som byggts, i en lista
- **Luckor i Figma** – allt du hittade som saknades eller var motsägelsefullt
- **Att titta på** – vad granskaren särskilt bör kontrollera i Chromatic

```bash
git switch -c komponent/<namn>
git add -A
git commit -m "Bygg <Namn> från Figma"
git push -u origin komponent/<namn>
gh pr create --fill
```

Lämna tillbaka PR-länken. Chromatic postar preview-länken i PR:en inom några
minuter.

## 9. Efter granskning

Ändringar från granskaren görs på samma gren – öppna ingen ny PR. När PR:en är
godkänd och ihopslagen är komponenten i Storybook.

Kör **inte** `npm run release`. Paketet publiceras bara på uttrycklig begäran.
