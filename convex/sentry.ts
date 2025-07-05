import * as Sentry from "@sentry/node";
import { internalMutation, internalQuery, internalAction } from "convex/_generated/server";

// Initialize Sentry for Convex (Node.js environment)
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.CONVEX_CLOUD_URL ? "production" : "development",
    tracesSampleRate: 0.1, // Lower rate for backend to reduce noise
    beforeSend(event) {
      // Filter out noise in development
      if (event.level === "info" || event.level === "debug") {
        return null;
      }
      return event;
    },
  });
}

// Enhanced wrapper with better error context
const wrap = (fn: any, type: string) => async (...args: any[]) => {
  try { 
    return await fn(...args); 
  } catch (err) { 
    Sentry.withScope((scope) => {
      scope.setTag("function_type", type);
      scope.setContext("convex_args", { args });
      Sentry.captureException(err);
    });
    throw err; 
  }
};

export const sentryMutation = (fn: any) => internalMutation(wrap(fn, "mutation"));
export const sentryQuery = (fn: any) => internalQuery(wrap(fn, "query"));
export const sentryAction = (fn: any) => internalAction(wrap(fn, "action"));