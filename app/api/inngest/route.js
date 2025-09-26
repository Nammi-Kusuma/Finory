import { serve } from "inngest/next";
import { inngest, inngest2 } from "@/lib/inngest/client";
import { checkBudgetAlert, triggerRecurringTransactions, processRecurringTransaction, generateMonthlyReport } from "@/lib/inngest/functions";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    checkBudgetAlert,
    triggerRecurringTransactions,
    processRecurringTransaction,
    generateMonthlyReport,
  ],
}); 