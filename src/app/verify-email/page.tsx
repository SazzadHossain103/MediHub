"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "./../../store/useAuthStore";

export default function VerifyEmailPage() {
  const router = useRouter();
  // const prefillEmail = searchParams.get("email") ?? "";
  // const [email, setEmail] = useState("");

  const { email, setUser, setToken, setError, setLoading, isLoading } =
    useAuthStore();

  const [otp, setOtp] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setError("Enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Verification failed");
      }

      // ✅ Save token (for patient auto-login)
      if (data.token) {
        setToken(data.token);
      }

      // ✅ Save user globally
      setUser({
        id: data.id || "temp", // better: return from backend or decode JWT
        name: data.name || "User",
        email: email!,
        role: data.role,
      });

      if (data.role === "hospital") {
        router.push("/hospital/login");
      }
      else router.push("/login");


    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleVerify}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4 text-center text-black">
          Verify Your Email
        </h2>

        <p className="text-sm text-gray-600 mb-4 text-center">
          Enter the 6-digit OTP sent to <b>{email}</b>
        </p>

        <input
          type="text"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="w-full border p-2 text-center text-lg text-black tracking-widest"
          placeholder="******"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 bg-blue-500 text-white p-2 rounded"
        >
          {isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}