"use client";

import { useActionState } from "react";
import { setupAccount } from "./actions";

const initialState = { error: "" };

export default function SetupAccountForm() {
  const [state, formAction, pending] = useActionState(async (_: typeof initialState, formData: FormData) => {
    const result = await setupAccount(formData);
    return result ?? initialState;
  }, initialState);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name *</label>
        <input
          name="full_name"
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1a6b1a]"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Mobile</label>
        <input
          name="phone"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1a6b1a]"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Set Password *</label>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1a6b1a]"
          placeholder="At least 8 characters"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm Password *</label>
        <input
          name="confirm_password"
          type="password"
          required
          minLength={8}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1a6b1a]"
        />
      </div>

      {state.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-[#1a6b1a] hover:bg-[#0f4a0f] disabled:opacity-60 text-white font-semibold rounded-lg py-2.5 text-sm transition"
      >
        {pending ? "Setting up…" : "Complete Setup"}
      </button>
    </form>
  );
}
