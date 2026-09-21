# Build-spec: atomic design i Figma

Åtgärdsplan för att bygga om Figma-biblioteket `Design system WIP`
(`jMxylLvF8eQlhbRLUUjgaP`) enligt atomic design, så att koden kan konsumera
elektroner i stället för duplicerade textnoder.

Alla ändringar görs i en **branch**, inte i huvudfilen. Branching finns inte i
Figmas Plugin-API, så branchen skapas för hand och dess nyckel används sedan som
`fileKey`.

## Steg

| # | Steg | Status |
| --- | --- | --- |
| 1 | Tokens: radius, ringfärger, textfärger | Specad |
| 2 | `Label` (elektron) | Ej specad |
| 3 | `FieldMessage` (elektron) | Ej specad |
| 4 | `FieldShell` (atom) | Ej specad |
| 5 | `Input Field` byggs om som pilot | Ej specad |
| 6 | Select, Textarea, Input Number, Date Picker, Time Picker | Ej specad |
| 7 | Button: storleksaxel, state-namn, fokus | Ej specad |
| 8 | Tabs-konsolidering, Breadcrumb-chevron | Ej specad |

---

## Steg 1 — Tokens

Ingenting ändras visuellt. Steget skapar bara variabler som saknas och ger rätt
betydelse åt värden som idag lånas från fel token. Ombindningen av komponenterna
sker i steg 4 och 5.

### Utgångsläge

Läst ur filen 2026-09-21:

- Samlingar: `Primitives` (64 variabler), `Semantic` (113), `Spacing` (12).
  Alla har ett enda läge, `Default`.
- `Spacing` är en egen samling med FLOAT-variabler — nya numeriska tokens följer
  samma mönster.
- Ingen `Focus`-namnrymd och ingen radius-samling finns.
- Samtliga 177 befintliga variabler har `ALL_SCOPES`.

### Problem som åtgärdas

**Radius är hårdkodat.** `rounded-[4px]` ligger som löst värde i Button
(96:42), Input (159:331) och FocusRing (159:356). Alla använder 4 px.

**Ringfärgerna är bundna till primitiver.** Fokusringen är en 3 px yttre ram
som binder `Blue/200`, `Green/200` respektive `Red/200` direkt — råpaletten
bunden i komponent, vilket bryter mot bibliotekets egen regel.

| State | Ring, 3 px yttre | Kant, 1 px inre |
| --- | --- | --- |
| Default | ingen | `Form/Input Border` |
| Focused | `Blue/200` | `Form/Input Border Focus` |
| Success | `Green/200` | `Form/Input Border Success` |
| Danger | `Red/200` | `Form/Input Border Error` |

**Två tokens används mot fel betydelse.** Hjälptexten färgas med
`Form/Input Placeholder` och felmeddelandet med `Form/Input Border Error` — en
ramfärg använd som textfärg.

### Nya samlingar

**`Radius`** (FLOAT)

| Variabel | Värde | Scopes |
| --- | --- | --- |
| `radius/md` | 4 | `CORNER_RADIUS` |
| `radius/full` | 9999 | `CORNER_RADIUS` |

**`Border`** (FLOAT)

| Variabel | Värde | Scopes |
| --- | --- | --- |
| `border/default` | 1 | `STROKE_FLOAT` |
| `border/ring` | 3 | `STROKE_FLOAT` |

Endast de värden som faktiskt används läggs in. Fler steg tillkommer när en
design behöver dem.

### Nya variabler i `Semantic`

| Variabel | Aliasar | Värde | Scopes |
| --- | --- | --- | --- |
| `Form/Help Text` | `Grey/600` | #888888 | `TEXT_FILL` |
| `Form/Error Text` | `Red/500` | #e93e3e | `TEXT_FILL` |
| `Focus/Ring Default` | `Blue/200` | #9bbcdf | `STROKE_COLOR` |
| `Focus/Ring Success` | `Green/200` | #8ec3b3 | `STROKE_COLOR` |
| `Focus/Ring Error` | `Red/200` | #f5a6a6 | `STROKE_COLOR` |

Alias, inte kopierade värden — ändras primitiven följer den semantiska med.

### Avvikelse från filens konvention

De nya variablerna får **explicita scopes**, medan filens befintliga 177 ligger
på `ALL_SCOPES`. Explicita scopes gör att variabeln bara dyker upp i de
egenskapsväljare där den hör hemma, i stället för i alla. Det påverkar inget
befintligt. Att scope-sätta de 177 gamla är en separat städning som kan göras
när som helst.

### Definition of done

- `Radius` och `Border` finns som samlingar med två variabler var
- Fem nya variabler i `Semantic`, alla som alias
- Inget befintligt värde ändrat, ingen komponent ombunden
- Verifierat genom att läsa tillbaka samlingarna och kontrollera att
  aliasen pekar på rätt primitiv

### Defekter hittade under specarbetet

Rättas i steg 5, inte här.

- **159:422** — input-texten i `State=Danger` är `Poppins Regular 16px`, medan
  övriga states är `CocogoosePro Light 14px`.
- **159:389** — `CheckLg`-ikonen i `State=Success` är 29,75 × 20,62 px i stället
  för 20 × 20. Samma förvrängda instans finns i Getting Started (200:516).
