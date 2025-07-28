import React from 'react'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { LayoutDashboard, PenBox } from 'lucide-react'

const Header = () => {
    return (
        <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
            <nav className='container mx-auto px-4 py-4 flex justify-between items-center'>
                {/* <Link href="/"><Image src="/next.svg" alt="Logo" className='h-12 w-auto object-contain' width={60} height={200} /></Link> */}
                <Link href="/">Finalyze</Link>

                <div className='flex items-center gap-2'>
                    <SignedIn>
                        <Link href="/dashboard" className='text-gray-600 hover:text-blue-600 flex items-center gap-2'>
                            <Button className='flex items-center gap-2' variant="outline">
                                <LayoutDashboard size={20}/>
                                <span className='hidden md:inline'>Dashboard</span>
                            </Button>
                        </Link>

                        <Link href="/transactions/create" className='text-gray-600 hover:text-blue-600 flex items-center gap-2'>
                            <Button className='flex items-center gap-2' variant="outline">
                                <PenBox size={20}/>
                                <span className='hidden md:inline'>Add Transaction</span>
                            </Button>
                        </Link>
                    </SignedIn>
                    <SignedOut>
                        <SignInButton forceRedirectUrl="/dashboard">
                            <Button className='flex items-center gap-2' variant="outline">
                                Login
                            </Button>
                        </SignInButton>
                        {/* <SignUpButton /> */}
                    </SignedOut>
                    <SignedIn>
                        <UserButton appearance={{
                            elements: {
                                avatarBox: "w-10 h-10"
                            }
                        }}/>
                    </SignedIn>
                </div>
            </nav>
        </div>
    )
}

export default Header
