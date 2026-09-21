import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Typografi",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Typsnittet är **Cocogoose Pro** (Zetafonts), NPA:s varumärkestypsnitt. Vikterna heter i Figma " +
          "Light (300), Semilight (350) och Darkmode (370) – namnen är Zetafonts egna, inte något " +
          "som har med mörkt läge att göra. Basstorleken är 14 px.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Rad = {
  stil: string;
  exempel: string;
  storlek: string;
  vikt: string;
  radhojd: string;
  anvandning: string;
  klass: string;
};

const RUBRIKER: Rad[] = [
  { stil: "Heading/H1", exempel: "Sidans huvudrubrik", storlek: "32px", vikt: "Darkmode 370", radhojd: "40px", anvandning: "Sidtitlar, modaltitlar", klass: "text-h1" },
  { stil: "Heading/H2", exempel: "Sektionsrubrik", storlek: "24px", vikt: "Semilight 350", radhojd: "30px", anvandning: "Sektionsrubriker", klass: "text-h2" },
  { stil: "Heading/H3", exempel: "Underrubrik", storlek: "20px", vikt: "Semilight 350", radhojd: "26px", anvandning: "Underrubriker", klass: "text-h3" },
  { stil: "Heading/H4", exempel: "Liten rubrik", storlek: "18px", vikt: "Semilight 350", radhojd: "24px", anvandning: "Kortrubriker", klass: "text-h4" },
];

const BRODTEXT: Rad[] = [
  { stil: "Body/Default", exempel: "Löpande text och beskrivningar", storlek: "14px", vikt: "Light 300", radhojd: "24px", anvandning: "Allmän brödtext", klass: "text-body font-light" },
  { stil: "Body/Medium", exempel: "Betonad brödtext", storlek: "14px", vikt: "Semilight 350", radhojd: "24px", anvandning: "Lätt betoning", klass: "text-body font-semilight" },
  { stil: "Body/Strong", exempel: "Stark betoning", storlek: "14px", vikt: "Darkmode 370", radhojd: "24px", anvandning: "Stark betoning", klass: "text-body font-darkmode" },
];

const UI: Rad[] = [
  { stil: "UI/Action", exempel: "Knappetikett", storlek: "14px", vikt: "Darkmode 370", radhojd: "20px", anvandning: "Knappar", klass: "text-ui font-darkmode" },
  { stil: "UI/Link", exempel: "Länktext", storlek: "14px", vikt: "Darkmode 370", radhojd: "20px", anvandning: "Klickbara länkar", klass: "text-ui font-darkmode" },
  { stil: "UI/Label", exempel: "Fältetikett", storlek: "14px", vikt: "Semilight 350", radhojd: "20px", anvandning: "Etiketter över fält", klass: "text-ui font-semilight" },
  { stil: "UI/Input Text", exempel: "Inmatad text", storlek: "14px", vikt: "Light 300", radhojd: "20px", anvandning: "Innehåll i inputfält", klass: "text-ui font-light" },
  { stil: "UI/Input Placeholder", exempel: "Platshållartext", storlek: "14px", vikt: "Light 300", radhojd: "20px", anvandning: "Placeholder", klass: "text-ui font-light" },
  { stil: "UI/Item Text", exempel: "Listalternativ", storlek: "14px", vikt: "Light 300", radhojd: "20px", anvandning: "Dropdown-alternativ, menyrader", klass: "text-ui font-light" },
  { stil: "UI/Breadcrumb", exempel: "Start / Sida", storlek: "14px", vikt: "Light 300", radhojd: "20px", anvandning: "Breadcrumb-navigering", klass: "text-ui font-light" },
];

const SMATT: Rad[] = [
  { stil: "Small/Badge", exempel: "Statusetikett", storlek: "12px", vikt: "Semilight 350", radhojd: "18px", anvandning: "Badges, statustaggar", klass: "text-small font-semilight" },
  { stil: "Small/Detail", exempel: "Hjälptext", storlek: "12px", vikt: "Light 300", radhojd: "18px", anvandning: "Beskrivande text under fält", klass: "text-small font-light" },
  { stil: "Small/Detail Strong", exempel: "Viktig detalj", storlek: "12px", vikt: "Darkmode 370", radhojd: "18px", anvandning: "Felmeddelanden", klass: "text-small font-darkmode" },
];

function Tabell({ rubrik, rader }: { rubrik: string; rader: Rad[] }) {
  return (
    <section className="mb-10">
      <h2 className="mb-1 text-h3 text-text-default">{rubrik}</h2>
      <div className="border-t border-border-default">
        <div className="grid grid-cols-[minmax(240px,2fr)_1fr_80px_130px_90px_1.4fr] gap-4 border-b border-border-default py-2 text-small font-semilight text-text-muted">
          <span>Förhandsgranskning</span>
          <span>Stil</span>
          <span>Storlek</span>
          <span>Vikt</span>
          <span>Radhöjd</span>
          <span>Användning</span>
        </div>
        {rader.map((rad) => (
          <div
            key={rad.stil}
            className="grid grid-cols-[minmax(240px,2fr)_1fr_80px_130px_90px_1.4fr] items-center gap-4 border-b border-border-default py-3"
          >
            <span className={`${rad.klass} text-text-default`}>{rad.exempel}</span>
            <code className="text-small text-text-secondary">{rad.stil}</code>
            <span className="text-small text-text-secondary">{rad.storlek}</span>
            <span className="text-small text-text-secondary">{rad.vikt}</span>
            <span className="text-small text-text-secondary">{rad.radhojd}</span>
            <span className="text-small text-text-secondary">{rad.anvandning}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export const Typskala: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="mb-2 text-h1 text-text-default">Typografi</h1>
      <p className="mb-8 max-w-[70ch] text-body text-text-secondary">
        Cocogoose Pro levereras med paketet som woff2. Konsumenten behöver inte ladda in något externt
        typsnitt – importen av <code>styles.css</code> räcker.
      </p>
      <Tabell rubrik="Rubriker" rader={RUBRIKER} />
      <Tabell rubrik="Brödtext" rader={BRODTEXT} />
      <Tabell rubrik="UI-element" rader={UI} />
      <Tabell rubrik="Liten text" rader={SMATT} />
    </div>
  ),
};
