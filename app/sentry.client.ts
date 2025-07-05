import * as Sentry from "@sentry/react";
import { useEffect } from "react";
import { 
  useLocation, 
  useNavigationType, 
  createRoutesFromChildren, 
  matchRoutes 
} from "react-router";
import { isFeatureEnabled, isServiceEnabled, getServiceConfig } from "../config";

if (isFeatureEnabled("monitoring") && isServiceEnabled("sentry")) {
  const sentryConfig = getServiceConfig("sentry");
  
  if (!sentryConfig?.dsn) {
    console.warn("Sentry DSN not configured");
  } else {
    Sentry.init({
      dsn: sentryConfig.dsn,
      integrations: [
        Sentry.reactRouterV7BrowserTracingIntegration({
          useEffect,
          useLocation,
          useNavigationType,
          createRoutesFromChildren,
          matchRoutes,
        }),
      ],
      tracesSampleRate: sentryConfig.tracesSampleRate || 0.2,
      environment: sentryConfig.environment || import.meta.env.MODE,
      beforeSend(event) {
        // Filter out development errors if needed
        if (import.meta.env.DEV && event.exception) {
          return null;
        }
        return event;
      },
    });
  }
}