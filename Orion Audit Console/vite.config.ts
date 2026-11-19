import path from "path";
import { defineConfig } from "vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { cloudflare } from "@cloudflare/vite-plugin";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { componentTagger } from "lovable-tagger";
import { mockupPreviewPlugin } from "./mockupPreviewPlugin.ts";

export default defineConfig(({ command, mode }) => {
  // Cloudflare Workers apenas quando explicitamente selecionado;
  // build padrão gera SPA estática (dist/client) 100% compatível com a Vercel.
  const useCloudflare = command === "build" && process.env.DEPLOY_TARGET === "cloudflare";

  return {
    server: {
      host: "::",
      port: 8080,
    },
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    plugins: [
      mockupPreviewPlugin({ designSystemPolling: true }),
      tsConfigPaths({ projects: ["./tsconfig.json"] }),
      ...(useCloudflare ? [cloudflare({ viteEnvironment: { name: "ssr" } })] : []),
      tanstackStart({
        spa: {
          enabled: true,
          prerender: {
            outputPath: "/index.html",
          },
        },
      }),
      viteReact(),
      ...(mode === "development" ? [componentTagger()] : []),
    ],
  };
});
