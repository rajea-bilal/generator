import { components } from "./_generated/api";
import { Resend } from "@convex-dev/resend";
import { internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Only check environment variables if email is enabled
const isEmailEnabled = process.env.EMAIL_ENABLED === 'true';

let fromEmail: string | undefined;
let companyName: string | undefined;
let resend: Resend | undefined;

if (isEmailEnabled) {
  fromEmail = process.env.DEFAULT_FROM_EMAIL;
  companyName = process.env.COMPANY_NAME;

if (!fromEmail || !companyName) {
  throw new Error(
      "DEFAULT_FROM_EMAIL and COMPANY_NAME environment variables must be set in your Convex deployment when email is enabled."
  );
}
  
  resend = new Resend(components.resend, {});
}

export const sendWelcomeEmail = internalMutation({
  args: { email: v.string(), name: v.string() },
  handler: async (ctx, { email, name }) => {
    if (!isEmailEnabled || !resend || !fromEmail || !companyName) {
      console.warn('Email service is disabled, skipping welcome email');
      return;
    }

    await resend.sendEmail(
      ctx,
      `${companyName} <${fromEmail}>`,
      email,
      `Welcome to ${companyName}, ${name}!`,
      `<h1>Welcome aboard, ${name}!</h1><p>We're excited to have you at ${companyName}.</p>`
    );
  },
}); 

// Export resend conditionally
export { resend }; 