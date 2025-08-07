import React from 'react'
import CreateAccountDrawer from '@/components/CreateAccountDrawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { getUserAccounts } from '@/actions/dashboard'
import AccountCard from './_components/AccountCard'
import { getBudget } from '@/actions/budget'
import BudgetCard from './_components/BudgetCard'

const DashboardPage = async () => {
    const accounts = await getUserAccounts()

    const defaultAccount = accounts?.find((account) => account.isDefault);
    let budgetData = null;
    if(defaultAccount) {
        budgetData = await getBudget(defaultAccount.id);
    }

  return (
    <div className='px-5 space-y-4'>
      {defaultAccount && (<BudgetCard 
      initialBudget={budgetData?.budget}
      currExpenses={budgetData?.currentExpenses}
      />)}
      
      <div className='mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        <CreateAccountDrawer >
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed h-[150px]">
                <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                    <Plus className='w-10 h-10 mb-2'/>
                    <p className='text-sm font-semibold mb-2'>Add Account</p>
                </CardContent>
            </Card>
        </CreateAccountDrawer>

        {accounts.length>0 && accounts?.map((account) => {
          return <AccountCard key={account.id} account={account}/>
        })}
      </div>
    </div>
  )
}

export default DashboardPage
