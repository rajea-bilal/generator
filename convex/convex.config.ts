// convex/convex.config.ts
import { defineApp } from "convex/server";

const app = defineApp();

// Only load components if their respective features are enabled
const isPaymentsEnabled = process.env.PAYMENTS_ENABLED === 'true';
const isEmailEnabled = process.env.EMAIL_ENABLED === 'true';

if (isPaymentsEnabled) {
  try {
    const polar = require("@convex-dev/polar/convex.config");
    app.use(polar.default || polar);
    console.log("Polar component loaded for payments");
  } catch (error) {
    console.warn("Failed to load Polar component:", error);
  }
}

if (isEmailEnabled) {
  try {
    const resend = require("@convex-dev/resend/convex.config");
    app.use(resend.default || resend);
    console.log("Resend component loaded for email");
  } catch (error) {
    console.warn("Failed to load Resend component:", error);
  }
}

export default app;
