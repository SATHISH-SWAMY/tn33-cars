

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function Login() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Sign In</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login to your account</DialogTitle>
            <DialogDescription>
             Enter your email below to login to your account
            </DialogDescription>
           
          </DialogHeader>
                <form>
           <div className="flex flex-col gap-6">
             <div className="grid gap-2">
               <Label htmlFor="email">Email</Label>
               <Input
                 id="email"
                 type="email"
                 placeholder="m@example.com"
                 required
               />
             </div>
             <div className="grid gap-2">
               <div className="flex items-center">
                 <Label htmlFor="password">Password</Label>
                 <a
                   href="#"
                   className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                 >
                   Forgot your password?
                 </a>
               </div>
               <Input id="password" type="password" required />
             </div>
           </div>
         </form>
          <Button variant="outline" className="w-full">
          Login with Google
        </Button>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Login</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}




