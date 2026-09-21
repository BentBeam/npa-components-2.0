import type { Meta, StoryObj } from "@storybook/react-vite";
import * as Ikoner from "../icons";

const meta = {
  title: "Foundations/Ikoner",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Ikonerna är exporterade direkt ur Figma-bibliotekets ikonsida, så de är garanterat identiska " +
          "med designen. De bygger på Bootstrap Icons, som ligger som devDependency för att göra det " +
          "enkelt att lägga till fler. Alla ikoner ärver textfärgen via `currentColor`.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ALLA = Object.entries(Ikoner)
  .filter(([namn]) => namn.startsWith("Icon"))
  .sort(([a], [b]) => a.localeCompare(b, "sv")) as [string, React.ComponentType<{ size?: number }>][];

export const Ikonbibliotek: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="mb-2 text-h1 text-text-default">Ikoner</h1>
      <p className="mb-8 max-w-[70ch] text-body text-text-secondary">
        {ALLA.length} ikoner. Standardstorlek är 20 px; de flesta finns även i 16 px.{" "}
        <code>CaretUpFill</code> finns bara i 12 px eftersom den bara används i sorteringspilar.
      </p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
        {ALLA.map(([namn, Ikon]) => (
          <div
            key={namn}
            className="flex flex-col items-center gap-2 rounded border border-border-default p-4 text-text-default"
          >
            <Ikon />
            <code className="text-small text-text-muted">{namn}</code>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Storlekar: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="mb-2 text-h1 text-text-default">Storlekar</h1>
      <p className="mb-8 max-w-[70ch] text-body text-text-secondary">
        Storleken skickas som <code>size</code>. TypeScript tillåter bara de storlekar som faktiskt finns
        i Figma för respektive ikon.
      </p>
      <div className="flex items-end gap-8 text-text-default">
        <div className="flex flex-col items-center gap-2">
          <Ikoner.IconSearch size={20} />
          <code className="text-small text-text-muted">size=20</code>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Ikoner.IconSearch size={16} />
          <code className="text-small text-text-muted">size=16</code>
        </div>
      </div>
    </div>
  ),
};

export const Färgärvning: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="mb-2 text-h1 text-text-default">Färg</h1>
      <p className="mb-8 max-w-[70ch] text-body text-text-secondary">
        Ikonerna ritas med <code>currentColor</code>, så de tar färg av texten omkring dem. Sätt färgen på
        föräldern i stället för på ikonen.
      </p>
      <div className="flex flex-wrap gap-6">
        <span className="flex items-center gap-2 text-text-default">
          <Ikoner.IconInfoCircle /> text-default
        </span>
        <span className="flex items-center gap-2 text-status-info-icon">
          <Ikoner.IconInfoCircle /> status-info-icon
        </span>
        <span className="flex items-center gap-2 text-status-success-icon">
          <Ikoner.IconCheck /> status-success-icon
        </span>
        <span className="flex items-center gap-2 text-status-error-icon">
          <Ikoner.IconExit /> status-error-icon
        </span>
        <span className="flex items-center gap-2 rounded bg-surface-inverse px-3 py-2 text-text-on-dark">
          <Ikoner.IconRocketTakeoff /> text-on-dark
        </span>
      </div>
    </div>
  ),
};

export const Tillgänglighet: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="mb-2 text-h1 text-text-default">Tillgänglighet</h1>
      <p className="mb-6 max-w-[70ch] text-body text-text-secondary">
        Utan <code>title</code> sätts <code>aria-hidden</code> automatiskt – rätt när ikonen sitter bredvid
        en text som säger samma sak. Står ikonen ensam, ge den en <code>title</code>.
      </p>
      <div className="flex flex-col gap-4">
        <span className="flex items-center gap-2 text-text-default">
          <Ikoner.IconTrash /> Ta bort
        </span>
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded border border-border-strong text-text-default"
        >
          <Ikoner.IconTrash title="Ta bort" />
        </button>
      </div>
    </div>
  ),
};
