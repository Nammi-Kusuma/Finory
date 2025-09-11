import { Badge } from 'lucide-react'
import React from 'react'

const Page = () => {
  return (
    <div className='flex flex-col pt-16'>
      <section  className="mt-20 pb-12 space-y-10 md:space-y-15 px-5">
        <div className='container mx-auto px-4 md:px-6 text-center space-y-6'>
        <Badge variant="outline" className="bg-green-100 text-green-700">
            Split expenses. Simplify life.
          </Badge>
        </div>
      </section>
    </div>
  )
}

export default Page
