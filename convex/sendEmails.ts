import { components, internal } from "./_generated/api";
import { Resend, vEmailId, vEmailEvent } from "@convex-dev/resend";
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

export const resend: Resend = new Resend(components.resend, {
  onEmailEvent: internal.sendEmails.handleEmailEvent,
});

export const handleEmailEvent = internalMutation({
  args: {
    id: vEmailId,
    event: vEmailEvent,
  },
  handler: async (ctx, args) => {
    console.log("Email event received:", args.id, args.event);
    // Handle email events here (deliveries, bounces, etc.)
    // You can update your database or trigger other actions based on the event
  },
});

export const sendTestEmail = internalMutation({
  handler: async (ctx) => {
    await resend.sendEmail(
      ctx,
      "Test <test@mydomain.com>",
      "delivered@resend.dev",
      "Test Email from Kaizen",
      "This is a test email from your Kaizen app!"
    );
  },
});

export const sendWelcomeEmail = internalMutation({
  args: { email: v.string(), name: v.string() },
  handler: async (ctx, { email, name }) => {
    await resend.sendEmail(
      ctx,
      "Kaizen <welcome@mydomain.com>",
      email,
      `Welcome to Kaizen, ${name}!`,
      `<h1>Welcome aboard, ${name}!</h1><p>We're excited to have you with us at Kaizen.</p>`
    );
  },
}); 