import { getAuth } from "@clerk/react-router/ssr.server";
import { redirect, useLoaderData } from "react-router";
import { AppSidebar } from "~/components/dashboard/app-sidebar";
import { SiteHeader } from "~/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import type { Route } from "./+types/layout";
import { createClerkClient } from "@clerk/react-router/api.server";
import { Outlet } from "react-router";
import { isFeatureEnabled, isServiceEnabled, config } from "../../../config";

export async function loader(args: Route.LoaderArgs) {
  const authEnabled = isFeatureEnabled('auth') && isServiceEnabled('clerk');
  const paymentsEnabled = isFeatureEnabled('payments');
  const convexEnabled = isFeatureEnabled('convex');

  let userId: string | null = null;
  let user: any = null;

  // Handle authentication if enabled
  if (authEnabled) {
    const auth = await getAuth(args);
    userId = auth.userId;

    // Redirect to sign-in if not authenticated
    if (!userId) {
      throw redirect("/sign-in");
    }

    // Get user data if auth is enabled
    user = await createClerkClient({
      secretKey: process.env.CLERK_SECRET_KEY,
    }).users.getUser(userId);
  }

  // Handle subscription check if payments are enabled
  if (paymentsEnabled && convexEnabled && userId) {
    // Dynamic import to avoid loading Convex when not needed
    const { fetchQuery } = await import("convex/nextjs");
    const { api } = await import("../../../convex/_generated/api");
    
    const subscriptionStatus = await fetchQuery(api.subscriptions.checkUserSubscriptionStatus, { userId });
    
    // Redirect to subscription-required if no active subscription
    if (!subscriptionStatus?.hasActiveSubscription) {
      throw redirect("/subscription-required");
    }
  }

  return { user, authEnabled, paymentsEnabled };
}

export default function DashboardLayout() {
  const { user, authEnabled } = useLoaderData();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" user={user} />
      <SidebarInset>
        <SiteHeader />
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
