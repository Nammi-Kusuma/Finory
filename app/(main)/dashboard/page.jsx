import React from 'react'
import CreateAccountDrawer from '@/components/CreateAccountDrawer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'

const DashboardPage = () => {
  return (
    <div className='px-5'>
      <div className='grid gap-4 ms:grid-cols-2 lg:grid-cols-3'>
        <CreateAccountDrawer >
            <Card className="hover:shadow-md transition-shadow cursor-pointer border-dashed h-[150px]">
                <CardContent className="flex flex-col items-center justify-center text-muted-foreground h-full pt-5">
                    <Plus className='w-10 h-10 mb-2'/>
                    <p className='text-sm font-semibold mb-2'>Add Account</p>
                </CardContent>
            </Card>
        </CreateAccountDrawer>
      </div>
    </div>
  )
}

export default DashboardPage
