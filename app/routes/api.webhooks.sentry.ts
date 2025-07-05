import type { ActionFunctionArgs } from "react-router";
import { json } from "react-router";
import { createOpenStatusMonitor } from "../lib/openstatus";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }
  
  const payload = await request.json();
  
  // Verify Sentry webhook signature (recommended for production)
  // const signature = request.headers.get("sentry-hook-signature");
  // if (!verifySentrySignature(payload, signature)) {
  //   return json({ error: "Invalid signature" }, { status: 401 });
  // }
  
  // Create incident in OpenStatus based on Sentry alert
  if (payload.action === "triggered") {
    await createOpenStatusMonitor({
      name: `Sentry Alert: ${payload.data.issue.title}`,
      url: payload.data.issue.permalink,
      description: `Error: ${payload.data.issue.culprit}`,
    });
  }
  
  return json({ success: true });
}