import React from 'react'

const Groups = async ({ params }) => {
    const { id } = await params;
    
  return (
    <div className='mt-30'>
      <h1>Group {id}</h1>
    </div>
  )
}

export default Groups    
