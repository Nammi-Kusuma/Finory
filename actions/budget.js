import { auth } from "@/auth";
import { db } from "@/db";

export async function getBudget() {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
        });

        if (!user) throw new Error("User not found");

        const budget = await db.budget.findFirst({
            where: {
                userId: user.id,
            },
        });

        if (!budget) return null;

        const currDate = new Date();
        const startOfMonth = new Date(currDate.getFullYear(), currDate.getMonth(), 1);
        const endOfMonth = new Date(currDate.getFullYear(), currDate.getMonth() + 1, 0);

        const totalExpenses = await db.transaction.aggregate({
            where: {
                userId: user.id,
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
                accountId,
                type: "EXPENSE",
            },
            _sum: {
                amount: true,
            },
        });

        return {
            success: true,
            budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
            currentExpenses: totalExpenses._sum.amount
                ? totalExpenses._sum.amount.toNumber()
                : 0,
        };
    } catch (error) {
        console.error("Error getting budget:", error);
        return { success: false, error: error.message };
    }
}
