"use client"

import { z } from "zod"
import { Helmet } from "react-helmet"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAppDispatch } from "@/store/hook"
import { loginSchema } from "@/validation/auth-validation"
import { login } from "@/store/slices/auth-slice"
import { toast } from "sonner"
import { useState } from "react"

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constant/route-constant"

type LoginData = z.infer<typeof loginSchema>

export default function LoginForm() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(false)

  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: LoginData) => {
    setLoading(true)
    try {
      await dispatch(login(data.email)).unwrap()
      localStorage.setItem("email", data.email)
      toast.success("OTP sent to your email")
      navigate(ROUTES.VERIFY_OTP)
    } catch (error) {
      toast(error as string, {
        className: "rounded-none",
      })
    } finally {
      setLoading(false)
    }
  }

  const emailError = form.formState.errors.email

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Login – API Train</title>
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
              <h2 className="text-2xl font-semibold tracking-tight">Log In</h2>
              <p className="text-sm text-muted-foreground">
                Enter your email to receive an OTP
              </p>
            </div>

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
                        font-medium 
                        transition-all
                    
                        ${emailError ? "border-red-500 shake" : ""}
                      `}
                    />
                  </FormControl>

                  <FormMessage className="text-red-500 text-xs" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full font-semibold h-11 rounded-md"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin h-4 w-4" />
                  Sending...
                </span>
              ) : (
                "Send OTP"
              )}
            </Button>

            {/* Footer */}
            <div className="pt-2 text-center">
              <p className="text-xs text-muted-foreground">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </form>
        </Form>
      </div>
    </>
  )
}
