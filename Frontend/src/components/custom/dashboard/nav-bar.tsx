"use client"

import { useState } from "react"
import { Check, CreditCard, Mail, Menu, Phone, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const navItems = [
    { name: "Overview", to: "/:username" },
    { name: "APIs", to: "/:username/apis" },
    { name: "Integration", to: "/:username/billing" },
    { name: "Billing", to: "/:username/billing" },
    { name: "Invite", to: "/:username/invite" },
    { name: "Settings", to: "/:username/settings" },
]

export default function Navbar() {
    const user = {
        name: 'Prathamesh More',
        email: 'prathamesh@example.com',
        phone: '+91 9876543210',
        avatarUrl: 'https://i.pravatar.cc/150?img=12',
    }
    const [open, setOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto flex items-center justify-between px-4 py-3 sm:px-6">
                {/* Left: Logo */}
                <div className="flex items-center gap-4 sm:gap-6">
                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.to}
                                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <Button variant='ghost' className="rounded-none touch-feedback"> {item.name}</Button>
                            </Link>
                        ))}
                    </nav>
                </div>
                
                {/* Right: Actions */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Pro Button - Hidden on mobile to save space */}
                    <div className="hidden sm:block">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="rounded-none flex items-center gap-2 touch-feedback">
                                    <CreditCard className="w-4 h-4" />
                                    <span>Pro</span>
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-md sm:max-w-lg rounded-none px-6 py-5 mobile-modal">
                                <DialogHeader>
                                    <DialogTitle className="text-lg">Pro Plan Details</DialogTitle>
                                    <DialogDescription className="text-sm text-muted-foreground">
                                        Unlock premium features and advanced tools with the Pro plan.
                                    </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4 py-4">
                                    <div>
                                        <h3 className="text-base font-medium mb-1">What's included:</h3>
                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                            <li className="flex items-start gap-2">
                                                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                                Unlimited projects and collaborators
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                                Advanced analytics and insights
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                                Priority support and early feature access
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="border-t pt-4">
                                        <p className="text-sm text-muted-foreground">Monthly Price</p>
                                        <p className="text-xl font-bold">₹499/mo</p>
                                    </div>

                                    <div className="pt-2">
                                        <Button className="w-full rounded-none">Upgrade to Pro</Button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>

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

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="touch-feedback">
                                    <Menu className="w-5 h-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[280px] p-6">
                                <div className="flex flex-col gap-4 mt-6">
                                    {/* Mobile Navigation Items */}
                                    {navItems.map((item) => (
                                        <Link
                                            key={item.name}
                                            to={item.to}
                                            onClick={() => setOpen(false)}
                                            className="text-base font-medium text-muted-foreground hover:text-foreground p-3 rounded-lg hover:bg-muted transition-colors touch-feedback"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                    
                                    {/* Mobile Pro Button */}
                                    <div className="border-t pt-4 mt-4">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="outline" className="w-full rounded-none touch-feedback">
                                                    <CreditCard className="w-4 h-4 mr-2" />
                                                    Upgrade to Pro
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-md rounded-none mobile-modal">
                                                <DialogHeader>
                                                    <DialogTitle className="text-lg">Pro Plan Details</DialogTitle>
                                                    <DialogDescription className="text-sm text-muted-foreground">
                                                        Unlock premium features and advanced tools with the Pro plan.
                                                    </DialogDescription>
                                                </DialogHeader>

                                                <div className="space-y-4 py-4">
                                                    <div>
                                                        <h3 className="text-base font-medium mb-1">What's included:</h3>
                                                        <ul className="space-y-2 text-sm text-muted-foreground">
                                                            <li className="flex items-start gap-2">
                                                                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                                                Unlimited projects and collaborators
                                                            </li>
                                                            <li className="flex items-start gap-2">
                                                                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                                                Advanced analytics and insights
                                                            </li>
                                                            <li className="flex items-start gap-2">
                                                                <Check className="w-4 h-4 text-green-500 mt-0.5" />
                                                                Priority support and early feature access
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className="border-t pt-4">
                                                        <p className="text-sm text-muted-foreground">Monthly Price</p>
                                                        <p className="text-xl font-bold">₹499/mo</p>
                                                    </div>

                                                    <div className="pt-2">
                                                        <Button className="w-full rounded-none">Upgrade to Pro</Button>
                                                    </div>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}
