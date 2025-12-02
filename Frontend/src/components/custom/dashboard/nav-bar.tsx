"use client"

import { useState } from "react"
import { Mail, Phone, User } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"


export default function Navbar() {
    const user = {
        name: 'Prathamesh More',
        email: 'prathamesh@example.com',
        phone: '+91 9876543210',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
    }
    const [open, setOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-28 bg-white">
            <div className="container mx-auto flex items-center justify-between py-3 sm:px-6 px-40 ">
                <div>
                    APItrain
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Pro Button - Hidden on mobile to save space */}


                    {/* User Avatar */}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Avatar className="h-8 w-8 sm:h-10 sm:w-10 rounded-none bg-black p-0.5 touch-feedback">
                                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                                <AvatarFallback className="rounded-none text-white bg-black">PM</AvatarFallback>
                            </Avatar>
                        </DialogTrigger>
                        <DialogContent className="max-w-sm sm:max-w-md rounded-none mobile-modal">
                            <DialogHeader>
                                <DialogTitle>User Details</DialogTitle>
                                <DialogDescription>Basic information about the user</DialogDescription>
                            </DialogHeader>

                            <div className="flex flex-col items-center gap-4 py-4">
                                <Avatar className="w-20 h-20 rounded-none">
                                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                                    <AvatarFallback>
                                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="text-center space-y-1">
                                    <h2 className="text-xl font-semibold flex items-center justify-center gap-2">
                                        <User className="w-5 h-5" /> {user.name}
                                    </h2>
                                    <p className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <Phone className="w-4 h-4" /> {user.phone}
                                    </p>
                                    <p className="flex items-center justify-center gap-2 text-muted-foreground">
                                        <Mail className="w-4 h-4" /> {user.email}
                                    </p>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>


                </div>
            </div>
        </header>
    )
}
