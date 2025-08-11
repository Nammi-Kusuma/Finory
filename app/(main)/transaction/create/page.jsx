import React from 'react'
import { getUserAccounts } from '@/actions/dashboard'
import { defaultCategories } from '@/data/categories'
import AddTransactionForm from '../_components/AddTransactionForm'
import { getTransaction } from '@/actions/transactions'

const CreateTransactionPage = async ({ searchParams }) => {
    const accounts = await getUserAccounts()

    const editId = searchParams?.edit;
    let initialData = null;
    if (editId) {
      const transaction = await getTransaction(editId);
      initialData = transaction;
    }

  return (
    <div className='px-5 max-w-3xl mx-auto'>
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl gradient-title ">{editId ? "Edit Transaction" : "Create Transaction"}</h1>
      </div>

      <AddTransactionForm accounts={accounts} categories={defaultCategories} initialData={initialData} editMode={!!editId}/>
    </div>
  )
}

export default CreateTransactionPage
