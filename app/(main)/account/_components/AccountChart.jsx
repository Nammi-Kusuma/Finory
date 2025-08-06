"use client"

import { endOfDay, startOfDay, subDays } from 'date-fns';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Rectangle } from 'recharts'
import { format } from 'date-fns';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DATE_RANGES = {
  "7D": { label: "Last 7 Days", days: 7 },
  "1M": { label: "Last Month", days: 30 },
  "3M": { label: "Last 3 Months", days: 90 },
  "6M": { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

const AccountChart = ({ transactions }) => {
  const [dateRange, setDateRange] = useState("1M");

  const filteredTransactions = useMemo(() => {
    const range = DATE_RANGES[dateRange];
    const now = new Date();
    const startDate = range.days ? startOfDay(subDays(now, range.days)) : startOfDay(new Date(0));

    const res = transactions.filter((transaction) =>
      new Date(transaction.date) >= startDate && new Date(transaction.date) <= endOfDay(now)
    );

    const groupedTransactions = res.reduce((acc, transaction) => {
      const date = format(new Date(transaction.date), "MMM dd");
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
      if (transaction.type === "INCOME") {
        acc[date].income += transaction.amount;
      } else {
        acc[date].expense += transaction.amount;
      }

      return acc;
    }, {});

    return Object.values(groupedTransactions).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [transactions, dateRange]);

  const totalValues = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, day) => ({
        income: acc.income + day.income,
        expense: acc.expense + day.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredTransactions]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal">Transactions Chart</CardTitle>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Select a range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, value]) => (
              <SelectItem key={key} value={key}>
                {value.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col items-center text-center">
            <p className="text-sm font-semibold">
              Total Income
            </p>
            <p className="text-lg font-bold text-green-500">
              ${totalValues.income.toFixed(2)}
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <p className="text-sm font-semibold">
              Total Expenses
            </p>
            <p className="text-lg font-bold text-red-500">
              ${totalValues.expense.toFixed(2)}
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <p className="text-sm font-semibold">
              Total Balance
            </p>
            <p className={`text-lg font-bold ${totalValues.income - totalValues.expense >= 0 ? "text-blue-500" : "text-red-500"}`}>
              ${(totalValues.income - totalValues.expense).toFixed(2)}
            </p>
          </div>
        </div>

        <div className='h-[300px] mt-4'>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredTransactions}
              margin={{
                top: 10,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`} />
              <Tooltip
                formatter={(value) => [`$${value}`, undefined]}
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                }}
              />
              <Legend />
              <Bar
                dataKey="income"
                name="Income"
                fill="#22c55e"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default AccountChart
