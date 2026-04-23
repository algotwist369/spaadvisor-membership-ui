"use client";

import React from "react";
import { Key, Phone, Shield, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAdminAuthStore } from "@/store/useAdminAuthStore";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const { requestOtp, verifyOtp } = useAdminAuthStore();
  const [step, setStep] = React.useState<"DETAILS" | "OTP">("DETAILS");
  const [mobileNumber, setMobileNumber] = React.useState("");
  const [otp, setOtp] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleRequestOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await requestOtp(mobileNumber);
      setStep("OTP");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to send admin OTP"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await verifyOtp(mobileNumber, otp);
      router.push("/admin/dashboard");
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Invalid OTP"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-primary/10 via-white to-white p-6">
      <div className="mx-auto flex min-h-screen max-w-md items-center">
        <div className="w-full">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-bold text-secondary-900">
              {step === "DETAILS" ? "Admin Access" : "Verify Admin OTP"}
            </h1>
            <p className="mt-2 text-secondary-500">
              {step === "DETAILS"
                ? "Use your registered mobile number to access the admin dashboard."
                : `Enter the 4-digit OTP sent to ${mobileNumber}`}
            </p>
          </div>

          <Card className="p-8">
            {error ? (
              <div className="mb-6 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            {step === "DETAILS" ? (
              <form onSubmit={handleRequestOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="ml-1 text-sm font-medium text-secondary-700">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400"
                      size={20}
                    />
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      value={mobileNumber}
                      onChange={(event) => setMobileNumber(event.target.value)}
                      className="input-field pl-12"
                      placeholder="Registered admin number"
                    />
                  </div>
                </div>

                <Button type="submit" isLoading={isLoading} className="w-full py-4 text-lg">
                  Send Admin OTP
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="space-y-2">
                  <label className="ml-1 text-sm font-medium text-secondary-700">OTP</label>
                  <div className="relative">
                    <Key
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400"
                      size={20}
                    />
                    <input
                      type="text"
                      required
                      maxLength={4}
                      pattern="[0-9]{4}"
                      value={otp}
                      onChange={(event) => setOtp(event.target.value)}
                      className="input-field pl-12 font-bold tracking-[0.8em]"
                      placeholder="0000"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button type="submit" isLoading={isLoading} className="w-full py-4 text-lg">
                    Verify & Login
                  </Button>
                  <button
                    type="button"
                    onClick={() => setStep("DETAILS")}
                    className="flex items-center justify-center gap-2 py-2 text-sm text-secondary-500 transition-colors hover:text-primary"
                  >
                    <ArrowLeft size={16} />
                    Back to number entry
                  </button>
                </div>
              </form>
            )}

            <div className="mt-8 border-t border-secondary-100 pt-8 text-center">
              <p className="text-sm text-secondary-500">
                Customer account?{" "}
                <Link href="/login" className="font-bold text-primary hover:underline">
                  Go to user login
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
