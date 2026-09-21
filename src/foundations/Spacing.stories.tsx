import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Spacing",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SKALA = [
  { token: "spacing/1", klass: "p-1", px: 4, anvandning: "Ikon-padding, inline-avstånd" },
  { token: "spacing/2", klass: "p-2", px: 8, anvandning: "Kompakt padding, täta element" },
  { token: "spacing/3", klass: "p-3", px: 12, anvandning: "Liten padding, gap mellan text och ikon" },
  { token: "spacing/4", klass: "p-4", px: 16, anvandning: "Standard komponentpadding (inputs, knappar)" },
  { token: "spacing/5", klass: "p-5", px: 20, anvandning: "Medium spacing" },
  { token: "spacing/6", klass: "p-6", px: 24, anvandning: "Större padding, avstånd mellan element" },
  { token: "spacing/7", klass: "p-7", px: 32, anvandning: "Sektionsavstånd, kortpadding" },
  { token: "spacing/8", klass: "p-8", px: 40, anvandning: "Layout-avstånd, formulärgrupper" },
  { token: "spacing/9", klass: "p-9", px: 48, anvandning: "Sidpadding, större layout-gap" },
  { token: "spacing/10", klass: "p-10", px: 64, anvandning: "Stora sektionsmellanrum" },
  { token: "spacing/11", klass: "p-11", px: 80, anvandning: "Hero-padding, sidsektioner" },
  { token: "spacing/12", klass: "p-12", px: 96, anvandning: "Maximal sidpadding" },
];

const GRID = [
  { bp: "Desktop (≥1440px)", kolumner: 12, gutter: "24px", marginal: "80px" },
  { bp: "Laptop (≥1024px)", kolumner: 12, gutter: "24px", marginal: "48px" },
  { bp: "Tablet (≥768px)", kolumner: 8, gutter: "16px", marginal: "32px" },
  { bp: "Mobil (<768px)", kolumner: 4, gutter: "16px", marginal: "16px" },
];

export const Skala: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="mb-2 text-h1 text-text-default">Spacing</h1>
      <p className="mb-8 max-w-[70ch] text-body text-text-secondary">
        Tolv steg. Tailwind-klasserna <code>p-1</code> … <code>p-12</code> (och <code>m-</code>,{" "}
        <code>gap-</code>) motsvarar <code>spacing/1</code> … <code>spacing/12</code> exakt. Skalan är inte
        Tailwinds standard – <code>p-4</code> är 16px här, inte 16px via 4×4-regeln.
      </p>
      <div className="border-t border-border-default">
        <div className="grid grid-cols-[120px_80px_240px_1fr] gap-4 border-b border-border-default py-2 text-small font-semilight text-text-muted">
          <span>Token</span>
          <span>Värde</span>
          <span>Visuellt</span>
          <span>Användning</span>
        </div>
        {SKALA.map((rad) => (
          <div
            key={rad.token}
            className="grid grid-cols-[120px_80px_240px_1fr] items-center gap-4 border-b border-border-default py-3"
          >
            <code className="text-small text-text-default">{rad.token}</code>
            <span className="text-small text-text-secondary">{rad.px}px</span>
            <div className="h-4 rounded-sm bg-action-primary" style={{ width: `${rad.px * 2}px` }} />
            <span className="text-small text-text-secondary">{rad.anvandning}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Grid: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="mb-2 text-h1 text-text-default">Grid-system</h1>
      <p className="mb-8 max-w-[70ch] text-body text-text-secondary">
        Fyra breakpoints. Tailwind-varianterna <code>tablet:</code>, <code>laptop:</code> och{" "}
        <code>desktop:</code> är inställda på samma värden.
      </p>
      <div className="border-t border-border-default">
        <div className="grid grid-cols-[240px_120px_120px_120px] gap-4 border-b border-border-default py-2 text-small font-semilight text-text-muted">
          <span>Breakpoint</span>
          <span>Kolumner</span>
          <span>Gutter</span>
          <span>Marginal</span>
        </div>
        {GRID.map((rad) => (
          <div
            key={rad.bp}
            className="grid grid-cols-[240px_120px_120px_120px] gap-4 border-b border-border-default py-3 text-body text-text-default"
          >
            <span>{rad.bp}</span>
            <span>{rad.kolumner}</span>
            <span>{rad.gutter}</span>
            <span>{rad.marginal}</span>
          </div>
        ))}
      </div>
    </div>
  ),
};
