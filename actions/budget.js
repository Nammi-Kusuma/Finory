"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache";

export async function getBudget(accountId) {
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
              type: "EXPENSE",
              date: {
                gte: startOfMonth,
                lte: endOfMonth,
              },
              accountId: accountId,
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

export async function updateBudget(amount) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
        });

        if (!user) throw new Error("User not found");

        const budget = await db.budget.upsert({
            where: {
                userId: user.id,
            },
            update: {
                amount,
            },
            create: {
                userId: user.id,
                amount,
            },
        });

        revalidatePath("/dashboard");
        return { success: true, data: { ...budget, amount: budget.amount.toNumber() } };
    } catch (error) {
        console.error("Error updating budget:", error);
        return { success: false, error: error.message };
    }
}