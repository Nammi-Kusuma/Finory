"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"

const serializetransaction = (transaction) => {
    const serialized = { ...transaction };
    
    if(transaction.balance) {
        serialized.balance = transaction.balance.toNumber();
    }

    return serialized;
}

export async function createAccount(data) {
    try {
        const { userId } = await auth();
        if(!userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,
            },
        });

        if(!user) throw new Error("User not found");

        const balanceFloat = parseFloat(data.balance);
        if(isNaN(balanceFloat)) throw new Error("Invalid balance");

        const existingAccount = await db.account.findMany({
            where: {
                userId: user.id,
            },
        });
        
        const shouldDef = existingAccount.length === 0 ? true : data.isDefault;

        if(shouldDef) {
            await db.account.updateMany({
                where: {
                    userId: user.id,
                    isDefault: true,
                },
                data: {
                    isDefault: false,
                },
            });
        }

        const account = await db.account.create({
            data: {
                ...data,
                userId: user.id,
                balance: balanceFloat,
                isDefault: shouldDef,
            },
        });

        const serializedAccount = serializetransaction(account);

        revalidatePath("/dashboard");
        return { success: true, data: serializedAccount };
    } catch (error) {
        console.error("Error creating account:", error);
        return { success: false, error: error.message };
    }
}
