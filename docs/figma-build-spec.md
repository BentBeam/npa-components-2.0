# Build-spec: atomic design i Figma

Åtgärdsplan för att bygga om Figma-biblioteket `Design system WIP`
(`jMxylLvF8eQlhbRLUUjgaP`) enligt atomic design, så att koden kan konsumera
elektroner i stället för duplicerade textnoder.

Alla ändringar görs i en **branch**, inte i huvudfilen. Branching finns inte i
Figmas Plugin-API, så branchen skapas för hand och dess nyckel används sedan som
`fileKey`.

Branch: `aKLtW0yCJjjEVh2VvOxyWi`

## Steg

| # | Steg | Status |
| --- | --- | --- |
| 1 | Tokens: radius, ringfärger, textfärger | **Klar** 2026-09-21 |
| — | Defekträttning och textstilsdokumentation | **Klar** 2026-09-21 |
| — | Granskning och rättning av Colors-sidan | **Klar** 2026-09-21 |
| 2 | `Label` (elektron) | **Klar** 2026-09-21 |
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

### Resultat

Utfört 2026-09-21 i branchen. `Semantic` gick från 113 till 118 variabler,
`Radius` och `Border` skapades med två variabler var. Alla fem alias verifierade
mot rätt primitiv och rätt hexvärde. Inget befintligt värde ändrades.

---

## Defekträttning

Utfört 2026-09-21, utanför den numrerade stegordningen.

### Rättat

**Poppins i Input Field `State=Danger, Content=Filled`** (159:422). Värdetexten
låg på `Poppins Regular 16px` utan textstil, medan motsvarande text i alla andra
states använder `UI/Input Text`. Textstilen är nu satt, vilket ger
`CocogoosePro Light 14px`. Danger-varianterna Empty och Placeholder var redan
korrekta.

**Poppins i 30 Time Option-instanser** i Time Picker Dropdown. Mastern
(135:3462/3464/3466) var hela tiden korrekt — `CocogoosePro Light 14` med
`UI/Item Text`. Det var instanserna som bar överskrivningar till Poppins och till
en textstil som inte finns lokalt, sannolikt ett arv från det gamla biblioteket.
Alla 30 är nu återställda till `UI/Item Text`.

### Inte en defekt

`CheckLg` (159:389) och `InfoCircle` (159:423) rapporterades tidigare som
förvrängda ikoner utifrån måtten 29,75 × 20,62 respektive 36 × 20. Det var fel.
Båda är auto-layout-behållare med padding — CheckLg har 5/8 runt en check-vektor
på 13,75 × 10,62, InfoCircle har 0/8 runt en 20 × 20-ikon. Proportionerna är
riktiga.

Kvar står en mindre inkonsekvens: ingen av dem använder ikonbibliotekets
komponenter, och behållarna är olika höga (20,62 mot 20). Tas i steg 5.

### Medvetet orört

`▲` och `▼` i Input Numbers stegkontroller (210:260, 210:262, 210:271, 210:273,
210:282, 210:284, 210:294, 210:296) är Poppins 10 px. De är textglyfer använda
som ikoner. Att byta typsnitt riskerar tomma rutor om Cocogoose Pro saknar
glyferna — de bör i stället ersättas med ikonkomponenten `CaretUpFill`, vilket
hör hemma i steg 6.

`+99` och `+100` (364:1400, 364:1403) ligger i lösa ramar kallade `W32 x H32`
och `W34 x H32` — skissmaterial, inte komponenter.

---

## Textstilsdokumentation

Utfört 2026-09-21.

Typography-sidans tabell beskrev den gamla Poppins-skalan medan
förhandsgranskningskolumnen redan renderade i de riktiga stilarna. 30 celler
rättades, 21 var redan korrekta — de fyra rubrikstorlekarna och samtliga 17
radhöjder.

Värdena härleds ur textstilarna i stället för att skrivas in för hand, så
tabellen kan byggas om från källan när stilarna ändras.

`Storlek`: brödtext, UI-element och liten text stod som 16/16/14 px men är
14/14/12 px.

`Vikt`: alla 17 rader stod i Poppins-termer (Regular, Medium, SemiBold) och står
nu i Cocogoose Pros egna namn med numerisk vikt — `Light (300)`,
`Semilight (350)`, `Darkmode (370)`.

Experimentramen `Testing CocoGoosePro` finns inte längre i filen, så
motsägelsen mellan den och huvudtabellen är borta.

Kvarstår: kolumnen `Användning` har texten `WIP` på fem rader — Heading/H3,
Heading/H4, Body/Medium, Body/Strong och UI/Label. Det är designerns egna
platshållare och inget jag fyllt i.

---

## Steg 2 — Label (elektron)

Utfört 2026-09-21.

Alla elektroner samlas på en egen sida, **`Elektroner`**, placerad direkt efter
`_Library components`.

### Label

Variantset `Label` (2009:7).

| Egenskap | Typ | Värden |
| --- | --- | --- |
| `State` | Variant | `Default`, `Disabled` |
| `Text` | Text | Standardvärde `Label` |

Textstil `UI/Label` (CocogoosePro Semilight 14/20). Färgen är **bunden till
variabel**, inte hårdkodad: `Text/Default` i Default och `Text/Disabled` i
Disabled. Disabled-färgen är hämtad ur Input Fields egna disabled-varianter, där
etiketten redan ligger på `Text/Disabled`.

Auto-layout horisontellt med 4 px mellanrum, så ett framtida `RequiredMarker`
kan läggas till utan att strukturen ändras.

### Öppen fråga

`Required` finns inte som egenskap. Biblioteket har idag ingen obligatorisk-
markör någonstans, så att lägga till en innebär att designa något nytt snarare
än att spegla det som finns. Tas när markören är bestämd.

---

## Granskning av Colors-sidan

Utfört 2026-09-21. 162 swatchar granskade.

Varje swatch är en ram med en rektangel som bär variabelbindningen plus två
textrader: tokennamnet och vilken primitiv den aliasar. Bindningarna var
korrekta i 154 av 162 fall.

### Rättat

Sex bildtexter angav fel primitiv. Rätt värde härleddes ur variabeln i stället
för att skrivas in för hand.

| Swatch | Stod | Är |
| --- | --- | --- |
| `Action/Danger Background Hover` | Red/600 | Red/700 |
| `Action/Success Background Hover` | Green/600 | Green/700 |
| `Form/Input Border Success` | Green/200 | Green/500 |
| `Status/Error Text` | Red/900 | Red/700 |
| `Status/Success Border` | Green/400 | Green/500 |
| `Border/Focus` | Blue/500 | Black |

`Form/Input Border` (rektangel 11:145) visade den hårdkodade färgen `#c8c8c8`
medan variabeln med samma namn är `#afafaf`. Swatchen visade alltså fel färg.
Den är nu bunden till variabeln och visar `#afafaf`.

### Kvarstår — behöver beslut

`Form/Input Border Hover` dokumenterar en token som inte finns. Rektangeln är
bunden till `Form/Input Border`. Antingen tas swatchen bort, eller så skapas en
riktig hover-token.

### Kvarstår — 21 variabler utan swatch

Sexton av dem är sedan tidigare odokumenterade: `White`, `Black`, `Grey/75`,
`Action/Primary Disabled Background`, `Action/Success Disabled Background`,
`Action/Danger Disabled Background`, `Action/Secondary Background`,
`Action/Secondary Background Hover`, `Action/Secondary Disabled Background`,
`Action/Secondary Text`, `Action/Ghost Disabled Border`,
`Action/Ghost Disabled Text`, `Action/Tertiary Background`,
`Action/Tertiary Background Hover`, `Action/Tertiary Text`,
`Action/Tertiary Disabled Text`.

De fem övriga är de som skapades i steg 1: `Form/Help Text`, `Form/Error Text`
och `Focus/Ring Default|Success|Error`.

### Följd för koden

`Grey/75` finns som primitiv i Figma men saknas i `src/styles/tokens.css`, som
bara har steg 50–950. Behöver läggas till vid nästa tokensynk.
