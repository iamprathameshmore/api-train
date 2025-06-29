"use client"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

export default function OTPVerificationScreen() {
  const [otp, setOtp] = useState("")

  const handleVerify = () => {
    if (otp.length === 6) {
      // Replace with actual verification logic
      console.log("OTP Entered:", otp)
      toast.success("OTP Verified Successfully!")
    } else {
      toast.error("Please enter a valid 6-digit OTP.")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow p-6 w-full max-w-md space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Verify Your Account</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter the 6-digit code sent to your phone or email.
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
