import React from 'react'
import { getUserAccounts } from '@/actions/dashboard'
import { defaultCategories } from '@/data/categories'
import AddTransactionForm from '../_components/AddTransactionForm'

const CreateTransactionPage = async () => {
    const accounts = await getUserAccounts()
  return (
    <div className='px-5 max-w-3xl mx-auto'>
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl gradient-title ">Create Transaction</h1>
      </div>

      <AddTransactionForm accounts={accounts} categories={defaultCategories}/>
    </div>
  )
}

export default CreateTransactionPage
