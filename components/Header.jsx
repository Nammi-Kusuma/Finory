"use client"

import React from 'react'
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'
import { LayoutDashboard, PenBox } from 'lucide-react'
import useStoreUserEffect from '@/hooks/useStoreUserEffect'
import { usePathname } from 'next/navigation'

const Header = ({ title }) => {
    const { user } = useUser();

    const pathName = usePathname();
    const { isLoading, isAuthenticated } = useStoreUserEffect();

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
        fetch("/api/check-user")
            .then(res => res.json())
            .then(data => {
                console.log("User checked/created:", data);
            })
            .catch(err => console.error("Check user failed:", err))
    }, []);

    if (!mounted) return null;

    return (
        <div className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
            <nav className='container mx-auto px-4 py-4 flex justify-between items-center'>
                {/* <Link href="/"><Image src="/next.svg" alt="Logo" className='h-12 w-auto object-contain' width={60} height={200} /></Link> */}
                <Link href="/">{title}</Link>

                {pathName === '/splito' && (
                    <div className='hidden md:flex items-center gap-6'>
                        <Link
                            href="#features"
                            className="text-sm font-medium hover:text-green-600 transition"
                        >
                            Features
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="text-sm font-medium hover:text-green-600 transition"
                        >
                            How It Works
                        </Link>
                    </div>
                )}

                <div className='flex items-center gap-2'>
                    <SignedIn>
                        {title === 'Finory' ? (<>
                            <Link href="/dashboard" className='text-gray-600 hover:text-blue-600 flex items-center gap-2' user={user}>
                                <Button className='flex items-center gap-2' variant="outline">
                                    <LayoutDashboard size={20} />
                                    <span className='hidden md:inline'>Dashboard</span>
                                </Button>
                            </Link>

                            <Link href="/transaction/create" className='text-gray-600 hover:text-blue-600 flex items-center gap-2'>
                                <Button className='flex items-center gap-2' variant="outline">
                                    <PenBox size={20} />
                                    <span className='hidden md:inline'>Add Transaction</span>
                                </Button>
                            </Link>
                        </>) : <>
                            <Link href="/splito/dashboard" className='text-gray-600 hover:text-blue-600 flex items-center gap-2' user={user}>
                                <Button className='flex items-center gap-2' variant="outline">
                                    <LayoutDashboard size={20} />
                                    <span className='hidden md:inline'>Splito Dashboard</span>
                                </Button>
                            </Link>
                        </>}
                    </SignedIn>
                    <SignedOut>
                        <SignInButton forceRedirectUrl={`${title === 'Finory' ? '/dashboard' : '/splito/dashboard'}`}>
                            <Button className='flex items-center gap-2' variant="outline">
                                Login
                            </Button>
                        </SignInButton>
                    </SignedOut>
                    <SignedIn>
                        <UserButton appearance={{
                            elements: {
                                avatarBox: "w-10 h-10"
                            }
                        }} />
                    </SignedIn>
                </div>
            </nav>
        </div>
    )
}

export default Header
