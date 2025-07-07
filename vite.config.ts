import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { isServiceEnabled } from "./config";

export default defineConfig({
  plugins: [
    tailwindcss(), 
    reactRouter(), 
    tsconfigPaths(),
    // Only add Sentry plugin if enabled and auth token is present
    isServiceEnabled("sentry") && process.env.SENTRY_AUTH_TOKEN && sentryVitePlugin({
      org: process.env.SENTRY_ORG || "your-sentry-org",
      project: process.env.SENTRY_PROJECT || "kaizen-app",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        assets: "./dist/**",
        ignore: ["node_modules"],
      },
      telemetry: false, // Disable telemetry for privacy
    }),
  ].filter(Boolean),
  server: {
    allowedHosts: ["2b8c4787d264.ngrok.app"],
  },
});
