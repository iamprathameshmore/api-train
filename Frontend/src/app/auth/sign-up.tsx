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

  const errors = form.formState.errors

  const onSubmit = async (data: SignupData) => {
    setLoading(true)
    try {
      await dispatch(signup(data)).unwrap()
      localStorage.setItem("email", data.email)
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
        <title>Sign Up – API Train</title>
      </Helmet>

      <div className="flex w-full">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="
              w-full max-w-sm 
              bg-white 
              rounded-xl 
              space-y-6 
              shadow-sm
            "
          >
            {/* Heading */}
            <div className="text-start space-y-1">
              <h2 className="text-2xl font-semibold tracking-tight">Sign Up</h2>
              <p className="text-sm text-muted-foreground">
                Create your account to get started
              </p>
            </div>

            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      disabled={loading}
                      className={`
                        transition-all
                        ${errors.name ? "border-red-500 shake" : ""}
                      `}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      {...field}
                      disabled={loading}
                      className={`
                        transition-all
                        ${errors.email ? "border-red-500 shake" : ""}
                      `}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Phone Number Field */}
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="+91 9876543210"
                      {...field}
                      disabled={loading}
                      className={`
                        transition-all
                        ${errors.phoneNumber ? "border-red-500 shake" : ""}
                      `}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button type="submit" className="w-full h-11 font-semibold" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin h-4 w-4" />
                  Signing...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  )
}
