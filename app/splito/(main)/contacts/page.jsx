"use client"

import { api } from '@/convex/_generated/api'
import { useConvexQuery } from '@/hooks/use-convex-query'
import React from 'react'
import { BarLoader } from 'react-spinners'

const Contacts = () => {
  const { data: contacts, isLoading, error } = useConvexQuery(api.contacts.getAllContacts)

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <BarLoader width={"100%"} color="#36d7b7" />
      </div>
    );
  }

  const { users, groups } = contacts || { users: [], groups: [] };

  return (
    <div className='mt-30'>
        <h1>Contacts</h1>
        
        {error && <p>Error: {error.message}</p>}
        <div>
            {users.map((user) => (
                <div key={user._id}>
                    <h2>{user.name}</h2>
                    <p>{user.email}</p>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Contacts
