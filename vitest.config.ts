import { defineConfig } from "vite";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig(async () => {
  // Importação dinâmica do plugin vite-tsconfig-paths
  const tsConfigPathsPlugin = await import("vite-tsconfig-paths");

  return {
    plugins: [tsConfigPathsPlugin.default()],
    test: {
      globals: true,
      environment: "node",
    },
  };
});
