import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Färger",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Alla färger kommer från variabelsamlingen i Figma-filen *Design system WIP*. " +
          "Primitiverna är råpaletten – bind dem aldrig direkt i en komponent. " +
          "Använd de semantiska tokens, så följer komponenterna med när paletten justeras.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const PALETTER = ["yellow", "green", "red", "orange", "blue", "grey"] as const;
const STEG = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
// Grey har två extra steg som de andra paletterna saknar.
const GREY_STEG = [50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function Swatch({ token, namn }: { token: string; namn: string }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="size-12 shrink-0 rounded border border-border-default"
        style={{ backgroundColor: `var(${token})` }}
      />
      <div className="min-w-0">
        <div className="text-small font-semilight text-text-default">{namn}</div>
        <code className="text-small font-light text-text-muted">{token}</code>
      </div>
    </div>
  );
}

function Sektion({ rubrik, children }: { rubrik: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-h3 text-text-default">{rubrik}</h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4">{children}</div>
    </section>
  );
}

const SEMANTISKA: Record<string, string[]> = {
  Brand: ["brand-accent", "brand-accent-hover", "brand-on-accent"],
  Navigation: [
    "nav-accent",
    "nav-background",
    "nav-text",
    "nav-footer-accent",
    "nav-breadcrumb-default",
    "nav-breadcrumb-active",
    "nav-tab-active-background",
    "nav-tab-active-border",
    "nav-tab-active-text",
    "nav-tab-hover-background",
    "nav-tab-inactive-text",
  ],
  Action: [
    "action-primary-background",
    "action-primary-background-hover",
    "action-primary-background-active",
    "action-primary-disabled-background",
    "action-primary-text",
    "action-secondary-background",
    "action-secondary-background-hover",
    "action-secondary-disabled-background",
    "action-tertiary-background",
    "action-tertiary-background-hover",
    "action-tertiary-text",
    "action-success-background",
    "action-success-background-hover",
    "action-danger-background",
    "action-danger-background-hover",
    "action-ghost-background-hover",
    "action-ghost-border",
    "action-ghost-text",
    "action-disabled-background",
    "action-disabled-border",
    "action-disabled-text",
  ],
  Formulär: [
    "form-input-background",
    "form-input-background-disabled",
    "form-input-background-error",
    "form-input-background-success",
    "form-input-border",
    "form-input-border-focus",
    "form-input-border-error",
    "form-input-border-success",
    "form-input-placeholder",
    "form-input-text",
    "form-input-text-disabled",
  ],
  Select: [
    "select-background",
    "select-highlighted-row",
    "select-item-hover-background",
    "select-item-selected-background",
    "select-item-selected-text",
    "select-section-header-background",
  ],
  Status: [
    "status-info-background",
    "status-info-border",
    "status-info-icon",
    "status-info-text",
    "status-success-background",
    "status-success-border",
    "status-success-icon",
    "status-success-text",
    "status-warning-background",
    "status-warning-border",
    "status-warning-icon",
    "status-warning-text",
    "status-error-background",
    "status-error-border",
    "status-error-icon",
    "status-error-text",
  ],
  Tabell: [
    "table-cell-border",
    "table-header-background",
    "table-header-border",
    "table-header-text",
    "table-row-default-background",
    "table-row-alternate-background",
    "table-row-hover-background",
  ],
  Taggar: [
    "tag-info-background",
    "tag-info-text",
    "tag-success-background",
    "tag-success-text",
    "tag-warning-background",
    "tag-warning-text",
    "tag-error-background",
    "tag-error-text",
  ],
  Text: [
    "text-default",
    "text-secondary",
    "text-muted",
    "text-disabled",
    "text-link",
    "text-link-hover",
    "text-on-brand",
    "text-on-dark",
    "text-on-primary",
  ],
  Ytor: ["surface-default", "surface-subtle", "surface-muted", "surface-inverse", "surface-overlay"],
  Ramar: [
    "border-default",
    "border-strong",
    "border-stronger",
    "border-primary",
    "border-focus",
    "border-error",
    "border-success",
  ],
};

export const Primitiver: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="mb-2 text-h1 text-text-default">Primitiver</h1>
      <p className="mb-8 max-w-[70ch] text-body text-text-secondary">
        Råpaletten, identisk med källsystemet &quot;Styling - komponenter NPA&quot;. Använd den bara när du
        definierar en ny semantisk token – aldrig direkt i en komponent.
      </p>
      {PALETTER.map((palett) => (
        <section key={palett} className="mb-8">
          <h2 className="mb-3 text-h4 text-text-default capitalize">{palett}</h2>
          <div className="flex flex-wrap gap-2">
            {(palett === "grey" ? GREY_STEG : STEG).map((steg) => (
              <div key={steg} className="w-[88px]">
                <div
                  className="h-16 rounded border border-border-default"
                  style={{ backgroundColor: `var(--npa-${palett}-${steg})` }}
                />
                <div className="mt-1 text-small font-semilight">{steg}</div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

export const Semantiska: Story = {
  render: () => (
    <div className="p-8">
      <h1 className="mb-2 text-h1 text-text-default">Semantiska tokens</h1>
      <p className="mb-8 max-w-[70ch] text-body text-text-secondary">
        Det här är de tokens komponenterna ska använda. Namnet säger vad färgen betyder, inte vilken färg
        den är – därför kan paletten ändras utan att komponenterna rörs.
      </p>
      {Object.entries(SEMANTISKA).map(([rubrik, tokens]) => (
        <Sektion key={rubrik} rubrik={rubrik}>
          {tokens.map((t) => (
            <Swatch key={t} token={`--npa-${t}`} namn={t} />
          ))}
        </Sektion>
      ))}
    </div>
  ),
};
