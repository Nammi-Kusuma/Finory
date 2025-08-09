import { z } from "zod";

export const accountSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    type: z.enum(["CURRENT", "SAVINGS"]),
    balance: z.coerce.number().min(0, "Balance must be at least 0"),
    isDefault: z.boolean().default(false),
});

export const transactionSchema = z.object({
    type: z.enum(["INCOME", "EXPENSE"]),
    amount: z.coerce.number().min(1, "Amount must be at least 1"),
    description: z.string().optional(),
    date: z.date({ required_error: "Date is required" }),
    category: z.string().min(1, "Category is required"),
    status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]),
    accountId: z.string().min(1, "Account is required"),
    isRecurring: z.boolean().default(false),
    recurringInterval: z.enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY"]).optional(),
}).superRefine((data, ctx) => {
    if (data.isRecurring && !data.recurringInterval) {
        ctx.addIssue({
            code: z.custom,
            message: "Recurring interval is required for recurring transactions",
            path: ["recurringInterval"],
        });
    }
})