"use client"

import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'
import React from 'react'

const Contacts = () => {
  const contacts = useQuery(api.contacts.getContacts)
  return (
    <div className='mt-30'>
        Contacts
    </div>
  )
}

export default Contacts
