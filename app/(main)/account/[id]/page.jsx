import React, { Suspense } from 'react'
import { getAccountWithTransactions } from '@/actions/accounts'
import { notFound } from 'next/navigation';
import TransactionsTable from '../_components/TransactionsTable';
import { BarLoader } from 'react-spinners';
import AccountChart from '../_components/AccountChart';

const AccountPage = async ({ params }) => {
  const { id } = params;
  const accountData = await getAccountWithTransactions(id);

  if (!accountData) {
    notFound();
  }

  const transactions = accountData.transactions;

  return (
    <div className="space-y-8 px-5">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize">
            {accountData.name}
          </h1>
          <p className="text-muted-foreground">
            {accountData.type.charAt(0) + accountData.type.slice(1).toLowerCase()}{" "}
            Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-xl sm:text-2xl font-bold">
            ${parseFloat(accountData.balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {accountData._count.transactions} Transactions
          </p>
        </div>
      </div>

      <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color="#9333ea" />}>
        <AccountChart transactions={transactions} />
      </Suspense>

      <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color="#9333ea" />}>
        <TransactionsTable transactions={transactions} />
      </Suspense>
    </div>
  )
}

export default AccountPage
