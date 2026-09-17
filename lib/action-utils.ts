import "server-only";
import { unstable_rethrow } from "next/navigation";

// Wraps a server action body so any unexpected throw (missing env var,
// unhandled Supabase error, etc.) becomes a friendly { error } response
// instead of an opaque 500 — Next.js on Cloudflare Workers doesn't render
// a helpful page for an action that throws. redirect()/notFound() calls
// (e.g. from requireProfile) are Next.js control-flow signals disguised as
// thrown errors, so they're rethrown untouched via unstable_rethrow.
export async function safeAction<T>(fn: () => Promise<T>): Promise<T | { error: string }> {
  try {
    return await fn();
  } catch (e) {
    unstable_rethrow(e);
    return { error: e instanceof Error ? e.message : "Something went wrong. Please try again." };
  }
}

// Same protection for actions whose callers don't check a return value
// (fire-and-forget, called from startTransition) — keeps the Promise<void>
// signature those callers rely on, but still prevents an uncaught throw
// from turning into an opaque 500.
export async function safeVoidAction(fn: () => Promise<void>): Promise<void> {
  try {
    await fn();
  } catch (e) {
    unstable_rethrow(e);
    console.error(e);
  }
}
