// Tillåter `import "./x.css"` – Vite hanterar filerna, TypeScript behöver bara
// veta att importen är giltig.
declare module "*.css";
