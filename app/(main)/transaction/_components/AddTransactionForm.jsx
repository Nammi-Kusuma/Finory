"use client"

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema } from '@/app/lib/schema'
import useFetch from '@/hooks/use-fetch'
import { createTransaction } from '@/actions/transactions'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import CreateAccountDrawer from '@/components/CreateAccountDrawer'
import { Button } from '@/components/ui/button'

const AddTransactionForm = ({ accounts, categories }) => {
    const { register, setValue, handleSubmit, formState: { errors }, watch, getValues, reset } = useForm({
        resolver: zodResolver(transactionSchema),
        defaultValues: {
            type: "EXPENSE",
            amount: 0,
            description: "",
            date: new Date(),
            category: "",
            status: "PENDING",
            accountId: accounts.find((account) => account.isDefault)?.id,
            isRecurring: false,
        },
    });

    const { loading, func: createTransactionFunc, data: createdTransaction, error } = useFetch(createTransaction);

    const type = watch("type");
    const isRecurring = watch("isRecurring");
    const date = watch("date");

    return (
        // <>
        <form className='space-y-6'>
            <div className='w-full space-y-2'>
                <label className='text-sm font-semibold' htmlFor="type">Type</label>
                <Select onValueChange={(value) => setValue("type", value)} defaultValue={type}>
                    <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="INCOME">Income</SelectItem>
                        <SelectItem value="EXPENSE">Expense</SelectItem>
                    </SelectContent>
                </Select>

                {errors.type && <p className='text-red-500'>{errors.type.message}</p>}
            </div>

            <div className='space-y-2 grid gap-6 md:grid-cols-2'>
                <div className='space-y-2'>
                    <label className='text-sm font-semibold' htmlFor="amount">Amount</label>
                    <Input {...register("amount")} type="number" step="0.01" placeholder="Amount" />

                    {errors.amount && <p className='text-red-500'>{errors.amount.message}</p>}
                </div>

                <div className='space-y-2'>
                    <label className='text-sm font-semibold' htmlFor="accountId">Account</label>
                    <Select onValueChange={(value) => setValue("accountId", value)} defaultValue={getValues("accountId")}>
                        <SelectTrigger className='w-full'>
                            <SelectValue placeholder="Select an account" />
                        </SelectTrigger>
                        <SelectContent>
                            {accounts.map((account) => (
                                <SelectItem key={account.id} value={account.id}>
                                    {account.name} (${parseFloat(account.balance).toFixed(2)})
                                </SelectItem>
                            ))}

                            <div className="my-1 border-t border-muted" />

                            {/* Centered Create Account */}
                            <CreateAccountDrawer>
                                <div className="w-full flex justify-center items-center">
                                    <Button
                                        variant="ghost"
                                        className="w-full py-2 text-center text-sm text-muted-foreground hover:text-accent-foreground hover:bg-accent rounded-sm"
                                    >
                                        + Create Account
                                    </Button>
                                </div>
                            </CreateAccountDrawer>
                        </SelectContent>
                    </Select>

                    {errors.accountId && <p className='text-red-500'>{errors.accountId.message}</p>}
                </div>
            </div>
        </form >
        // </>
    )
}

export default AddTransactionForm
