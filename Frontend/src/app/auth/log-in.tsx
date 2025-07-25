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
import { Loader, Loader2 } from "lucide-react" // Spinner icon
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
        <title>Log In - API Train</title>
      </Helmet>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 max-w-sm w-full bg-white p-6 rounded-xl shadow-none"
          >
            <h2 className="text-xl font-bold text-center">Login</h2>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} disabled={loading} className="rounded-none font-bold"/>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full rounded-none hover:bg-pink-500" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin h-4 w-4" />
                  Sending...
                </span>
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </>
  )
}
