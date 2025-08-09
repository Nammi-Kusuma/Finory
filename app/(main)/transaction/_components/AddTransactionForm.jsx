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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Switch } from '@/components/ui/switch'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useEffect } from 'react'

const AddTransactionForm = ({ accounts, categories }) => {
    const router = useRouter();
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

    const filteredCategories = categories.filter((category) => category.type === type);

    const onSubmit = async (data) => {
        const transactionData = {
            ...data,
            amount: parseFloat(data.amount),
        }

        await createTransactionFunc(transactionData)
    }

    useEffect(() => {
        if (createdTransaction?.success && !loading) {
            toast.success("Transaction created successfully")
            reset()
            router.push(`/account/${createdTransaction.data.accountId}`)
        }
    }, [createdTransaction, loading])

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to create transaction")
        }
    }, [error])

    return (
        <form className='space-y-6' onSubmit={handleSubmit(onSubmit)}>
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

            <div className='space-y-2'>
                <label className='text-sm font-semibold' htmlFor="category">Category</label>
                <Select onValueChange={(value) => setValue("category", value)} defaultValue={getValues("category")}>
                    <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                        {filteredCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {errors.category && <p className='text-red-500'>{errors.category.message}</p>}
            </div>

            <div className='space-y-2'>
                <label className='text-sm font-semibold' htmlFor="category">Date</label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-full pl-3 text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={(date) => setValue("date", date)}
                            disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                {errors.date && <p className='text-red-500'>{errors.date.message}</p>}
            </div>

            <div className='space-y-2'>
                <label className='text-sm font-semibold' htmlFor="description">Description</label>
                <Input {...register("description")} type="text" placeholder="Description" />

                {errors.description && <p className='text-red-500'>{errors.description.message}</p>}
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <label className="text-sm font-medium">Recurring Transaction</label>
                    <p className="text-sm text-muted-foreground">Set up a recurring schedule for this transaction</p>
                </div>
                <Switch checked={isRecurring}
                    onCheckedChange={(checked) => setValue("isRecurring", checked)} />
            </div>

            {isRecurring && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Recurring Interval</label>
                    <Select
                        onValueChange={(value) => setValue("recurringInterval", value)}
                        defaultValue={getValues("recurringInterval")}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select interval" />
                        </SelectTrigger>
                        <SelectContent className="w-full">
                            <SelectItem value="DAILY">Daily</SelectItem>
                            <SelectItem value="WEEKLY">Weekly</SelectItem>
                            <SelectItem value="MONTHLY">Monthly</SelectItem>
                            <SelectItem value="YEARLY">Yearly</SelectItem>
                        </SelectContent>
                    </Select>

                    {errors.recurringInterval && (
                        <p className="text-sm text-red-500">
                            {errors.recurringInterval.message}
                        </p>
                    )}
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <Button
                    type="button"
                    variant="outline"
                    className=""
                    onClick={() => router.back()}
                >
                    Cancel
                </Button>
                <Button type="submit" className="" disabled={loading}>
                    {loading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {"Creating..."}
                        </>
                    ) : (
                        "Create Transaction"
                    )}
                </Button>
            </div>
        </form >
    )
}

export default AddTransactionForm
