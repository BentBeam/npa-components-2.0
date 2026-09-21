# Så jobbar vi

Den här filen beskriver hur en komponent tar sig från Figma till designsystemet
när flera personer arbetar parallellt. Den förutsätter inte att du kan
programmera — du kommer inte att behöva läsa kod någonstans i flödet.

Två meningar som resten av dokumentet bygger på:

> **Ingen skriver direkt till designsystemet.** Allt går via ett förslag som
> någon tittar på först.
>
> **Du granskar hur det ser ut, inte hur det är skrivet.** Att koden är korrekt
> kontrolleras av robotar.

---

## Ordlistan, en gång

| Ord | Vad det betyder här |
| --- | --- |
| **Gren** (branch) | Ett förslag som ännu inte är en del av biblioteket. Du kan ha flera samtidigt utan att de stör varandra. |
| **Pull request** (PR) | Begäran om att få in en gren i biblioteket. Det är här granskningen sker. |
| **`main`** | Själva biblioteket. Det som ligger i Storybook och går ut i npm-paketet. |
| **CI** | Robotarna som kontrollerar varje förslag automatiskt. Grön bock = godkänt, rött kryss = något är fel. |
| **Chromatic** | Tjänsten som bygger en egen Storybook för varje förslag och markerar vad som ser annorlunda ut än förut. |

Du behöver aldrig skriva ett git-kommando. Agenten sköter grenar, commits och
pull requests åt dig.

---

## Vad som förväntas av dig

### 1. Bygg en komponent i taget

Skriv i Claude Code:

```
/ny-komponent Checkbox
```

En komponent per förslag. Två komponenter i samma PR gör granskningen rörig och
gör det omöjligt att släppa igenom den ena men inte den andra.

### 2. Godkänn listan innan bygget

Agenten svarar **inte** med en färdig komponent. Den svarar med en lista: vilka
varianter och states den hittat i Figma, vilka tokens den tänker binda, och vad
som saknas i designen.

Läs listan. Det är här du fångar att en hover-variant glömts i Figma, eller att
agenten tänker bygga något som är `[WIP]`. Svara "kör" eller peka ut felet.

Det här steget är inte en formalitet — det är den billigaste punkten i hela
flödet att rätta något på.

### 3. Vänta på PR-länken

Agenten bygger, kör kontrollerna och öppnar ett förslag. Du får en länk till
github.com. Där finns:

- **Beskrivningen** — vilka varianter som byggts, vilka luckor som hittades i
  Figma, och vad du särskilt bör titta på.
- **Kontrollerna** — grön bock eller rött kryss. Är den röd: skriv "CI är röd,
  fixa det" till agenten. Du behöver inte tolka loggen.
- **Chromatic-länken** — postas som en kommentar inom några minuter.

### 4. Granska i Chromatic

Det här är ditt jobb i flödet, och det enda ingen automat kan ta.

Öppna Chromatic-länken och ha Figma bredvid. Gå igenom:

- Stämmer grundläget med designen?
- **Finns alla states, och stämmer de?** Hover, fokus, disabled, fel. Det är här
  fel brukar sitta — grundläget blir nästan alltid rätt.
- Går komponenten att använda? Klicka i den, skriv i den.
- Har något *annat* ändrats som inte skulle det? Chromatic markerar varje
  visuell skillnad mot förra godkända versionen i rött. En röd markering på en
  komponent du inte rörde är en varningssignal värd att ta på allvar.

Godkänn eller avvisa varje markerad skillnad i Chromatic.

### 5. Säg vad som är fel — i PR:en

Skriv kommentaren på PR-sidan på github.com, inte i en chatt eller på ett möte.
Då står den kvar bredvid förslaget och kan bockas av.

Skriv på designspråk. "Ramen är för ljus i hover" är en fullt användbar
felrapport — du behöver inte veta vilken token som är fel.

Agenten rättar på **samma gren**. Ingen ny PR, ingen ny länk.

### 6. Godkänn och slå ihop

När Chromatic är godkänt, CI är grön och du är nöjd: klicka **Approve** och
sedan **Merge**. Komponenten är nu i Storybook.

Din signatur betyder *"designen stämmer"*. Inte *"koden är korrekt"* — det har
robotarna redan svarat för.

---

## Vad du inte ska göra

- **Läs inte fliken "Files changed".** Den är inte skriven för dig, och du
  riskerar att godkänna eller avvisa på fel grund.
- **Slå inte ihop en PR med rött kryss.** Det röda krysset betyder att något är
  trasigt, oavsett hur bra det ser ut i Chromatic.
- **Be inte om att publicera paketet i samma veva.** `npm run release` är ett
  eget, medvetet beslut. Komponenten syns i Storybook direkt ändå.
- **Jobba inte vidare på någon annans gren** utan att säga till. Ni skriver över
  varandra.

---

## Vad som händer i `/ny-komponent`

Skillen ligger i [`.claude/skills/ny-komponent/SKILL.md`](../.claude/skills/ny-komponent/SKILL.md)
och är committad i repot — alltså samma för alla, oavsett vem som promptar. Det
är hela poängen med den: den gör att formuleringen av din prompt inte längre
avgör hur komponenten byggs.

De nio stegen den kör:

| Steg | Vad agenten gör | Din del |
| --- | --- | --- |
| 1 | Läser komponenten i Figma — uppbyggnad, variabler, skärmbild. Stannar om den är `[WIP]`. | — |
| 2 | **Listar varianter, props, tokens och luckor.** | **Du godkänner.** |
| 3 | Bygger fyra filer: komponenten, stories, Code Connect, export. Härmar referenskomponenten. | — |
| 4 | Skriver en story per variant, på svenska, interaktiva. | — |
| 5 | Kopplar Code Connect mot nod-id:t. Validerar, publicerar inte. | — |
| 6 | Jämför sitt resultat mot skärmbilden från steg 1 och rättar. | — |
| 7 | Kör `npm run check`. Rättar det som fälls. | — |
| 8 | Öppnar en PR på egen gren, med beskrivning skriven för en designer. | — |
| 9 | Rättar på samma gren efter din granskning. | **Du granskar.** |

Två punkter är värda att lägga märke till:

**Steg 2 är den enda spärren mot att fel saker byggs.** Regeln för WIP-märkning
är opt-out: allt som inte är märkt `[WIP]` byggs. Det är en bra regel så länge
märkningen är ajour, och en dålig dag när någon glömt märka. Listan i steg 2
fångar det.

**Steg 7 är den enda spärren mot att fel saker släpps igenom.** Agenten kan inte
välja bort den, och kontrollerna körs om i CI oavsett vad som sagts lokalt.

---

## Vad robotarna kontrollerar

`npm run check`, både lokalt och i CI vid varje förslag:

| Kontroll | Fäller |
| --- | --- |
| Typkontroll | Kod som inte hänger ihop — fel propsnamn, saknad import |
| Lint | Vanliga misstag och slarv |
| Husregler | Hexkoder eller pixelvärden i en komponent, filer som saknas, komponent som glömts exporteras |
| Storybook-bygge | Att Storybook överhuvudtaget går att bygga |

Husreglerna ligger i [`scripts/check-komponenter.mjs`](../scripts/check-komponenter.mjs).
Behöver ett hårdkodat värde verkligen finnas — för att Figma saknar en token —
går det att motivera i koden, men då syns motiveringen i diffen och kan
ifrågasättas. Det är avsikten.

Chromatic körs separat och **fäller aldrig bygget**. Visuella skillnader är ofta
avsiktliga; det är därför en människa godkänner dem.
