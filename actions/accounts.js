"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

const serializetransaction = (transaction) => {
    const serialized = { ...transaction };

    if (transaction.balance) {
        serialized.balance = transaction.balance.toNumber();
    }

    if (transaction.amount) {
        serialized.amount = transaction.amount.toNumber();
    }

    return serialized;
}

export async function updateDefaultAccount(accountId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
        });

        if (!user) throw new Error("User not found");

        await db.account.updateMany({
            where: {
                userId: user.id,
                isDefault: true,
            },
            data: {
                isDefault: false,   
            },
        });

        const account = await db.account.update({
            where: {
                id: accountId,
                userId: user.id,
            },
            data: {
                isDefault: true,
            },
        });

        revalidatePath("/dashboard");
        const serializedAccount = serializetransaction(account);
        return { success: true, data: serializedAccount };
    } catch (error) {
        console.error("Error updating default account:", error);
        return { success: false, error: error.message };
    }
}

export async function getAccountWithTransactions(accountId) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
        });

        if (!user) throw new Error("User not found");

        const account = await db.account.findUnique({
            where: {
                id: accountId,
                userId: user.id,
            },
            include: {
                transactions: {
                    orderBy: {
                        date: "desc",
                    },
                },
                _count: {
                    select: {
                        transactions: true,
                    },
                },
            },
        });

        if (!account) return null;

        return {
            success: true,
            ...serializetransaction(account),
            transactions: account.transactions.map(serializetransaction),
          };
    } catch (error) {
        console.error("Error getting account transactions:", error);
        return { success: false, error: error.message, transactions: [], account: null };
    }
}

export async function deleteTransactions(transactionIds) {
    try {
        const { userId } = await auth();
        if (!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
        });

        if (!user) throw new Error("User not found");

        const transactions = await db.transaction.findMany({
            where: {
                id: {
                    in: transactionIds,
                },
                userId: user.id,
            },
        });

        const accountBalance = transactions.reduce((acc, transaction) => {
            const change = transaction.type === "EXPENSE" ? transaction.amount : -transaction.amount;

            acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
            return acc;
        }, {});

        await db.$transaction(async (tx) => {
            await tx.transaction.deleteMany({
                where: {
                    id: {
                        in: transactionIds,
                    },
                    userId: user.id,
                },
            });

            for (const [accountId, balance] of Object.entries(accountBalance)) {
                await tx.account.update({
                    where: {
                        id: accountId,
                        // userId: user.id,
                    },
                    data: {
                        balance: {
                            increment: balance,
                        }
                    },
                });
            }
        })

        revalidatePath("/dashboard");
        revalidatePath("/account/[id]");
        return { success: true };
    } catch (error) {
        console.error("Error deleting transaction:", error);
        return { success: false, error: error.message };
    }
}