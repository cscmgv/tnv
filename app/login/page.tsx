"use client";

import { useActionState } from "react";
import Image from "next/image";
import { login } from "./actions";

const initialState = { error: "" };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(async (_: typeof initialState, formData: FormData) => {
    const result = await login(formData);
    return result ?? initialState;
  }, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-[#e2e6ed]">
        <div className="flex flex-col items-center mb-6">
          <Image src="/tnv-logo.png" alt="TNV" width={64} height={64} className="rounded-full mb-3" />
          <h1 className="text-lg font-bold text-gray-900">TNV Leadership Selection</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Sign in to continue</p>
        </div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              autoComplete="username"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1a6b1a]"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1a6b1a]"
              placeholder="••••••••"
            />
          </div>

          {state.error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-[#1a6b1a] hover:bg-[#0f4a0f] disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 text-sm transition"
          >
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">
          Interviewer accounts are created by the Admin. Forgot your password? Contact Admin for a reset.
        </p>
      </div>
    </div>
  );
}
