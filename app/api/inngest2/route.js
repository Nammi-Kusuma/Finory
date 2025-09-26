import { serve } from "inngest/next";
import { inngest2 } from "@/lib/inngest2/client";
import { paymentReminders, spendingInsights } from "@/lib/inngest2/functions";

export const { GET, POST, PUT } = serve({
  client: inngest2,
  functions: [
    paymentReminders,
    spendingInsights,
  ],
}); 