import { SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Login } from './login/Login';
import axios from 'axios';

function Header() {

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: ""
    });

    const [isSignedIn, setIsSignedIn] = useState(false);
    const [user, setUser] = useState(null);
    console.log("user", user);
      // ✅ Restore login state from localStorage on page reload
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsSignedIn(true);
    }
  }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
      email: form.email,
      password: form.password,
    });

    // ✅ Save token
    const token = res.data.token;
    localStorage.setItem("authToken", token);
    setIsSignedIn(true);
    alert("Login successful!");

    // ✅ Fetch current user details
    const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = userRes.data;
    console.log("Current User:", user);
    // Optional: Save user in React state or context
    localStorage.setItem("currentUser", JSON.stringify(user));
    setUser(user);
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};


    const handleSignup = async (e) => {
        console.log("form", form);

        e.preventDefault();
        try {
            const res = await axios.post( `${import.meta.env.VITE_API_URL}/auth/register`, {
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                password: form.password,
            });

            alert("Account created!");
            setIsSignedIn(true);
        } catch (err) {
            alert(err.res?.data?.message || "Signup failed");
            console.log("Error during signup:", err);

        }
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        setIsSignedIn(false);
    };
    return (
        <div className='flex justify-between items-center  shadow-sm px-10 pr-16' >
            <img src='/logo.jpg' width={100} height={50} />
            {/* <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-4 p-4 w-100">
                                
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Components</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid gap-4 p-4 w-100">
                                <ListItem title="Alert Dialog" href="/docs/primitives/alert-dialog">
                                    A modal dialog that interrupts the user.
                                </ListItem>
                                <ListItem title="Alert Dialog" href="/docs/primitives/alert-dialog">
                                    A modal dialog that interrupts the user.
                                </ListItem>
                                <ListItem title="Alert Dialog" href="/docs/primitives/alert-dialog">
                                    A modal dialog that interrupts the user.
                                </ListItem>
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu> */}
            <div>
                <NavigationMenu>
                    <NavigationMenuList>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className="px-4 py-2 text-sm font-medium">
                                <a href="/">Home</a>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuLink asChild className="px-4 py-2 text-sm font-medium">
                                <a href="/AllCarLists">All Cars</a>
                            </NavigationMenuLink>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                                Sell / Buy
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-4 w-64">
                                    <li>
                                        <a href="/BuyNewCar" className="block text-sm font-medium">Buy a Car</a>
                                        <p className="text-muted-foreground text-xs">Browse certified new and used cars.</p>
                                    </li>
                                    <li>
                                        <a href="/SaleForm" className="block text-sm font-medium">Sell Your Car</a>
                                        <p className="text-muted-foreground text-xs">Get offers from trusted buyers.</p>
                                    </li>
                                    <li>
                                        <a href="/CarValuation" className="block text-sm font-medium">Car Valuation</a>
                                        <p className="text-muted-foreground text-xs">Know your car’s market value.</p>
                                    </li>
                                    <li>
                                        <a href="/testDriveForm" className="block text-sm font-medium">Book a Test Drive</a>
                                        <p className="text-muted-foreground text-xs">Schedule a doorstep test drive.</p>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                        <NavigationMenuItem>
                            <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
                                Owner Services
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid gap-3 p-4 w-64">
                                    <li>
                                        <a href="/SaleForm" className="block text-sm font-medium">Service History</a>
                                        <p className="text-muted-foreground text-xs">View your car's service record.</p>
                                    </li>
                                    <li>
                                        <a href="/SaleForm" className="block text-sm font-medium">Car Loan</a>
                                        <p className="text-muted-foreground text-xs">Quick loan approvals, low EMIs.</p>
                                    </li>
                                    <li>
                                        <a href="/SaleForm" className="block text-sm font-medium">Exchange Offer</a>
                                        <p className="text-muted-foreground text-xs">Trade in your car for a new one.</p>
                                    </li>
                                    <li>
                                        <a href="/SaleForm" className="block text-sm font-medium">Insurance</a>
                                        <p className="text-muted-foreground text-xs">Buy or renew your policy easily.</p>
                                    </li>
                                    <li>
                                        <a href="/SaleForm" className="block text-sm font-medium">RTO Services</a>
                                        <p className="text-muted-foreground text-xs">Paperwork, registration, transfer.</p>
                                    </li>
                                    <li>
                                        <a href="/SaleForm" className="block text-sm font-medium">Detailing & Coating</a>
                                        <p className="text-muted-foreground text-xs">Ceramic coating, car spa, and more.</p>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>

                    </NavigationMenuList>
                </NavigationMenu>


            </div>
            {isSignedIn ? (
                // ✅ If user is signed in, show avatar + dropdown
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>{user?.fullNmae}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>Billing</DropdownMenuItem>
                            <DropdownMenuItem>Team</DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout} >Log Out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ) : (
                // ❌ Not signed in: show Signup/Login Dialog
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-[#d32f2f] hover:bg-[#b71c1c] px-6 py-3 text-white text-lg rounded-xl transition-all duration-300 shadow-xl w-25 h-14 font-semibold flex items-center justify-center gap-2">
                            Sign Up
                        </Button>
                    </DialogTrigger>

                    <DialogContent className="h-120 p-10 rounded-2xl border border-gray-200 shadow-2xl bg-gradient-to-br from-white to-gray-50">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-center mb-4">
                                🚘 Welcome to AutoHub
                            </DialogTitle>
                            <p className="text-sm text-center text-gray-500">
                                Log in or create an account to fuel your car buying journey
                            </p>
                        </DialogHeader>

                        <Tabs defaultValue="login" className="w-full mt-4">
                            <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-100 p-1 rounded-full">
                                <TabsTrigger value="login" className="rounded-full">Login</TabsTrigger>
                                <TabsTrigger value="signup" className="rounded-full">Sign Up</TabsTrigger>
                            </TabsList>

                            {/* Login Tab */}
                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Button type="submit" className="bg-[#d32f2f] hover:bg-[#b71c1c] text-white font-semibold">
                                        🔑 Log In
                                    </Button>
                                </form>
                            </TabsContent>

                            {/* Sign Up Tab */}
                            <TabsContent value="signup">
                                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                                    <Input
                                        type="text"
                                        name="fullName"
                                        placeholder="Full Name"
                                        value={form.fullName}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        type="tel"
                                        name="phone"                             // ← must match state key
                                        placeholder="Phone (e.g. 9876543210)"
                                        value={form.phone}
                                        onChange={handleChange}
                                        required
                                        pattern="\d{10}"                         // ← simple 10‑digit check
                                        title="Enter a 10‑digit phone number"
                                    />

                                    <Input
                                        type="password"
                                        name="password"
                                        placeholder="Create Password"
                                        value={form.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Button type="submit" className="bg-[#1976d2] hover:bg-[#125ea4] text-white font-semibold">
                                        🏁 Sign Up
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>
            )}

        </div>
    )
}

export default Header