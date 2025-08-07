"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateBudget } from '@/actions/budget'
import { toast } from 'sonner'
import { Pencil } from 'lucide-react'
import { BarLoader } from 'react-spinners'
import useFetch from '@/hooks/use-fetch'
import { Progress } from '@/components/ui/progress'

const BudgetCard = ({ initialBudget, currExpenses }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(initialBudget?.amount?.toString() || "");

  const percentageUsed = initialBudget ? (currExpenses / initialBudget.amount) * 100 : 0;

  const { loading: updateBudgetLoading, func: updateBudgetFunc, data: updatedBudget, error: updateBudgetError } = useFetch(updateBudget);

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Invalid budget amount");
      return;
    }

    await updateBudgetFunc(amount);
  }

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (updateBudgetError) {
      toast.error(updateBudgetError.message || "Failed to update budget");
    }
  }, [updateBudgetError]);


  const handleCancel = () => {
    setIsEditing(false);
    setNewBudget(initialBudget?.amount?.toString() || "");
  }

  return (
    <div>
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <CardTitle className='text-lg font-bold'>Monthly Budget (Default Account)</CardTitle>
          <div className='flex items-center gap-2 mt-2'>
            {isEditing ? (
              <div className='flex items-center gap-2'>
                <Input type="number" value={newBudget} onChange={(e) => setNewBudget(e.target.value)} className="w-32" placeholder="Enter" disabled={updateBudgetLoading} />
                <Button variant="default" onClick={handleUpdateBudget} className="cursor-pointer" disabled={updateBudgetLoading}>Save</Button>
                <Button variant="ghost" onClick={handleCancel} className="cursor-pointer" disabled={updateBudgetLoading}>Cancel</Button>
              </div>
            ) : (
              <>
                <CardDescription>
                  {initialBudget
                    ? `${currExpenses.toFixed(2)} of ${initialBudget.amount.toFixed(2)} spent`
                    : "No budget set"}
                </CardDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6 cursor-pointer"
                  disabled={updateBudgetLoading}
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {updateBudgetLoading && <BarLoader className='mt-4' width={"100%"} color="#9333ea" />}
          {!updateBudgetLoading && (
            <div className='mt-4 space-y-2'>
              {initialBudget && (<>
                <Progress value={percentageUsed}
                  extraStyles={`${percentageUsed >= 90
                      ? "bg-red-500"
                      : percentageUsed >= 75
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {percentageUsed.toFixed(1)}% used
                </p>
                <div className='flex flex-row items-center justify-between gap-4'>
                  <div>
                    <p className='text-sm font-semibold'>Current Budget</p>
                    <p className='text-lg font-bold'>${initialBudget?.amount?.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className='text-sm font-semibold'>Current Expenses</p>
                    <p className='text-lg font-bold'>${currExpenses?.toFixed(2)}</p>
                  </div>
                </div>
              </>)}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default BudgetCard
