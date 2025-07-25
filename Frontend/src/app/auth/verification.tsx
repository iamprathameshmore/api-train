"use client"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useAppDispatch } from "@/store/hook"
import { verifyOtp } from "@/store/slices/auth-slice"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constant/route-constant"

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState("")
  const [email, setEmail] = useState("")
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const storedEmail = localStorage.getItem("email")
    if (storedEmail) {
      setEmail(storedEmail)
    } else {
      toast.error("No email found. Please sign up again.")
      navigate(ROUTES.SIGNUP) // redirect if no email
    }
  }, [navigate])

  const handleVerify = async () => {
    if (otp.length !== 6) {
      return toast.error("Please enter a valid 6-digit OTP.")
    }

    try {
      const result = await dispatch(verifyOtp({ email, otp })).unwrap()
      sessionStorage.setItem("accessToken", result)
      toast.success("OTP Verified Successfully!")
      navigate(ROUTES.USER_DASHBOARD.HOME)
    } catch (error) {
      toast.error(error as string)
    }
  }

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Verify Your Account</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter the 6-digit code sent to <span className="font-medium">{email}</span>
          </p>
        </div>

        <InputOTP
          maxLength={6}
          value={otp}
          onChange={(val) => setOtp(val)}
          className="mx-auto"
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>

        <Button className="w-full" onClick={handleVerify}>
          Verify
        </Button>

        <p className="text-sm text-center text-gray-500">
          Didn't receive the code?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => toast("Resending OTP...")}
          >
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  )
}
