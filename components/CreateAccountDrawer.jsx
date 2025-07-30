"use client"

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerClose } from "@/components/ui/drawer"
import React, { useEffect, useState } from 'react'
import { DrawerDescription } from './ui/drawer'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'
import { Switch } from './ui/switch'
import { accountSchema } from "@/app/lib/schema"
import useFetch from "@/hooks/use-fetch"
import { createAccount } from "@/actions/dashboard"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const CreateAccountDrawer = ({ children }) => {
    const [open, setOpen] = useState(false)

    const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            name: "",
            type: "CURRENT",
            balance: 0,
            isDefault: false,
        }
    })

    const { data: newAccount, error, func: createAccountFunc, loading: createAccountLoading } = useFetch(createAccount)

    useEffect(() => {
        if (newAccount && !createAccountLoading) {
            toast.success("Account created successfully")
            reset()
            setOpen(false)
        }
    }, [newAccount, createAccountLoading])

    useEffect(() => {
        if (error) {
            toast.error(error.message || "Failed to create account")
        }
    }, [error])

    const onSubmit = async (data) => {
        await createAccountFunc(data)
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger>{children}</DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Create Account</DrawerTitle>
                    <DrawerDescription>Fill the form below to create a new account</DrawerDescription>
                </DrawerHeader>

                <div className="py-4 px-4">
                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Account Name</label>
                            <Input type="text" id="name" {...register("name")} placeholder="Enter account name"/>
                            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="type" className="text-sm font-medium">Account Type</label>
                            <Select onValueChange={(value) => setValue("type", value)} defaultValue={watch("type")} {...register("type")}>
                                <SelectTrigger className="w-full" id="type">
                                    <SelectValue placeholder="Select account type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CURRENT">Current</SelectItem>
                                    <SelectItem value="SAVINGS">Savings</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="text-red-500">{errors.type.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="balance" className="text-sm font-medium">Balance</label>
                            <Input type="number" id="balance" {...register("balance")} placeholder="Enter balance"/>
                            {errors.balance && <p className="text-red-500">{errors.balance.message}</p>}
                        </div>
                        <div className="flex items-center justify-between rounded-lg border p-3">
                            <div className="space-y-2">
                                <label htmlFor="isDefault" className="text-sm font-medium">Set as Default</label>
                                <p className="text-sm text-muted-foreground">This will set this account as default</p>
                            </div>
                            <Switch id="isDefault" onCheckedChange={(checked) => setValue("isDefault", checked)} checked={watch("isDefault")} {...register("isDefault")}/>
                        </div>
                        <div className="flex justify-end gap-4 pt-4">
                            <DrawerClose asChild>
                                <Button type="button" variant="outline" className="flex-1">Cancel</Button>
                            </DrawerClose>
                            <Button type="submit" className="flex-1" disabled={createAccountLoading}>{createAccountLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Account"}</Button>
                        </div>
                    </form>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default CreateAccountDrawer
