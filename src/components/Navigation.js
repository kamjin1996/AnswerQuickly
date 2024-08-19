'use client'

import {useState, useEffect} from 'react'
import Link from 'next/link'
import {usePathname, useRouter} from 'next/navigation'
import {Github} from 'lucide-react'
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {signIn, signOut} from "next-auth/react";
import {useAccount} from "@/context/AccountContext";
import Image from 'next/image'
import {Avatar} from "@/components/ui/account";
import {Input} from "@/components/ui/input";

const navItems = [
    {path: '/', label: 'Home'},
    {path: '/resources', label: 'Resources'},
    {path: '/posts', label: 'Articles'},
    {path: '/contributors', label: 'Contributors'},
]


export function Navigation() {
    const pathname = usePathname()
    const router = useRouter()
    const {accountInfo, acquired} = useAccount()

    const [searchText, setSearchText] = useState('')

    const isLoggedIn = acquired && accountInfo?.name

    const handleLogout = async () => {
        try {
            await signOut();
            router.push('/');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    const handleSearch = () => {
        if (searchText && searchText.length > 0) {
            router.push(`/posts?text=${searchText}`)
        }
    }

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex gap-6 md:gap-10">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="inline-block font-bold">Answer Quickly</span>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={cn(
                                    "flex items-center text-sm font-medium text-muted-foreground",
                                    item.path === pathname && "text-foreground"
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>

                <div className='ml-4 w-80 flex space-x-1.5'><Input name="search" value={searchText}
                                                                 onChange={(e) => {
                                                                     setSearchText(e.target.value)
                                                                 }}/>
                    <Button disabled={!searchText || searchText.length < 1} onClick={handleSearch}>Search</Button>
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="https://github.com/kamjin1996/answer-quickly"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <Github className="h-5 w-5"/>
                        <span className="sr-only">GitHub</span>
                    </Link>
                    {isLoggedIn ? (
                        <>
                            <Link href={`https://github.com/${accountInfo.github_page}`}>
                                <Avatar src={accountInfo.avatar} alt={accountInfo.name}
                                        size={36}></Avatar>
                            </Link>
                            <Button onClick={handleLogout} variant="outline">Logout</Button>
                        </>
                    ) : (
                        <Button onClick={() => {
                            signIn('github')
                        }}>Join</Button>
                    )}
                </div>
            </div>
        </header>
    )
}
