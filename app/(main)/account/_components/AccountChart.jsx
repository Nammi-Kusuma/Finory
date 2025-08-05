import React from 'react'
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Rectangle } from 'recharts'

const AccountChart = ({ transactions }) => {
  return (
    <div>
      Account Chart
      <ResponsiveContainer width="100%" height="100%">
      <BarChart
        width={500}
        height={300}
        data={transactions}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="amount" fill="#8884d8" activeBar={<Rectangle fill="pink" stroke="blue" />} />
      </BarChart>
    </ResponsiveContainer>
    </div>
  )
}

export default AccountChart
