import React from 'react'

const Footer = ({title}) => {
  return (
    <footer className="bg-blue-50 py-12">
    <div className="container mx-auto px-4 text-center text-gray-600">
      <p>{title}</p>
      <p>© {new Date().getFullYear()} {title}. All rights reserved.</p>
    </div>
  </footer>
  )
}

export default Footer
