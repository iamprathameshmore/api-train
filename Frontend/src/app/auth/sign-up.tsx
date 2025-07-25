"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { signupSchema } from "@/validation/auth-validation"
import { useAppDispatch } from "@/store/hook"
import { useState } from "react"
import { signup } from "@/store/slices/auth-slice"
import { Loader } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constant/route-constant"
import { Helmet } from "react-helmet"

type SignupData = z.infer<typeof signupSchema>

export default function SignupForm() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const form = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", phoneNumber: "" },
  })

  const onSubmit = async (data: SignupData) => {
    setLoading(true)
    try {
      await dispatch(signup(data)).unwrap()
      localStorage.setItem("email", data.email) // ✅ Save email
      toast.success("OTP sent to your email")
      navigate(ROUTES.VERIFY_OTP)
    } catch (error) {
      toast.error(error as string)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Sign Up - API Train</title>
      </Helmet>
      <div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-sm w-full bg-white p-6 rounded-xl shadow-none">
            <h2 className="text-xl font-bold text-center">Sign Up</h2>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="+91 9876543210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">{loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="animate-spin h-4 w-4" />
                Signing...
              </span>
            ) : (
              "Sign Up"
            )}</Button>
          </form>
        </Form>

      </div>
    </>

  )
}
