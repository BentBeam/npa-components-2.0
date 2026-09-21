/**
 * Publikt API för @npa-eval/components2.0.
 *
 * Konsumenten importerar stilarna en gång:
 *   import "@npa-eval/components2.0/styles.css";
 * och sedan komponenter härifrån.
 */

// Stilarna bakas in i bygget via denna import – den ger dist/styles.css.
import "./styles/global.css";

export * from "./icons";
