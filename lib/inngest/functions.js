import { inngest } from "./client";
import { db } from "@/lib/prisma";

export const checkBudgetAlert = inngest.createFunction(
    { id: "Check Budget Alert" },
    { cron: "0 */6 * * *" },
    async ({ step }) => {
        const budgets = await step.run("budget-fetch", async () => {
            return await db.budget.findMany({
                include: {
                    user: {
                        include: {
                            accounts: {
                                where: {
                                    isDefault: true,
                                }
                            }
                        }
                    }
                }
            })
        });

        for (const budget of budgets) {
            const defaultAccount = budget.user.accounts.find((account) => account.isDefault);

            if (!defaultAccount) continue;

            const budgetData = await step.run(`budget-check-${budget.id}`, async () => {
                const currDate = new Date();
                const startOfMonth = new Date(currDate.getFullYear(), currDate.getMonth(), 1);
                const endOfMonth = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0);


                const expenses = await db.transaction.aggregate({
                    where: {
                        userId: budget.userId,
                        accountId: defaultAccount.id,
                        type: "EXPENSE",
                        date: {
                            gte: startOfMonth,
                            lte: endOfMonth,
                        },
                    },
                    _sum: {
                        amount: true,
                    },
                });

                const totalExpenses = expenses._sum.amount?.toNumber() || 0;
                const budgetAmount = budget.amount;
                const percentageUsed = (totalExpenses / budgetAmount) * 100;

                if (
                    percentageUsed >= 80 &&
                    (!budget.lastAlertSent ||
                        isNewMonth(new Date(budget.lastAlertSent), new Date()))
                ) {
                    // await sendEmail({
                    //   to: budget.user.email,
                    //   subject: `Budget Alert for ${defaultAccount.name}`,
                    //   react: EmailTemplate({
                    //     userName: budget.user.name,
                    //     type: "budget-alert",
                    //     data: {
                    //       percentageUsed,
                    //       budgetAmount: parseInt(budgetAmount).toFixed(1),
                    //       totalExpenses: parseInt(totalExpenses).toFixed(1),
                    //       accountName: defaultAccount.name,
                    //     },
                    //   }),
                    // });

                    await db.budget.update({
                        where: { id: budget.id },
                        data: { lastAlertSent: new Date() },
                    });
                }
            });
        }
    },
);