import type { Preview } from "@storybook/react-vite";
import "../src/styles/global.css";

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    options: {
      storySort: {
        order: [
          "Kom igång",
          ["Introduktion", "Installation", "Arbetsflöde"],
          "Foundations",
          ["Färger", "Typografi", "Spacing", "Grid", "Ikoner"],
          "Komponenter",
        ],
      },
    },
    backgrounds: {
      options: {
        ljus: { name: "Ljus", value: "#ffffff" },
        dampad: { name: "Dämpad", value: "#f3f3f3" },
        morkt: { name: "Mörk (nav/footer)", value: "#1d1d1d" },
      },
    },
  },
  initialGlobals: {
    backgrounds: { value: "ljus" },
  },
};

export default preview;
