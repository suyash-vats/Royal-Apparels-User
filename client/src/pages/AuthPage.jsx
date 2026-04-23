import { useState } from "react";
import { Navigate } from "react-router-dom";
import { SignIn, SignUp } from "@clerk/react";
import { useStore } from "../store";
import { clerkAppearance } from "../clerk";
import { BRAND_NAME } from "../utils";
import PageLoader from "../components/PageLoader";
import EmptyState from "../components/EmptyState";

export default function AuthPage() {
  const { authConfigured, authLoaded, isSignedIn, user } = useStore();
  const [mode, setMode] = useState("signIn");
  const redirectUrl = user?.role === "admin" ? "/admin" : "/account";

  if (!authConfigured) {
    return (
      <section className="section">
        <EmptyState
          title="Clerk sign in needs one key"
          body="Add VITE_CLERK_PUBLISHABLE_KEY in client/.env, then this page becomes the secure Clerk account flow."
          actionLabel="Back to home"
          actionTo="/"
        />
      </section>
    );
  }

  if (!authLoaded) {
    return <PageLoader label="Loading secure sign in" />;
  }

  if (isSignedIn && !user) {
    return <PageLoader label="Syncing your account" />;
  }

  if (user) {
    return <Navigate to={redirectUrl} replace />;
  }

  return (
    <section className="section auth-layout">
      <div className="auth-panel auth-panel--visual">
        <p className="eyebrow">{BRAND_NAME} account</p>
        <h1>Come back to your saved pieces, details, and orders</h1>
        <p>Sign in for a faster checkout, easier order lookups, and a closer place to keep the pieces you keep returning to.</p>
        <div className="auth-provider-note">
          <p>Secured by <strong>Clerk</strong> with email and social sign in.</p>
        </div>
      </div>
      <div className="auth-panel auth-panel--form auth-panel--clerk">
        <div className="auth-switch">
          <button type="button" className={mode === "signIn" ? "is-active" : ""} onClick={() => setMode("signIn")}>Sign in</button>
          <button type="button" className={mode === "signUp" ? "is-active" : ""} onClick={() => setMode("signUp")}>Create account</button>
        </div>
        {mode === "signIn" ? (
          <SignIn withSignUp signUpUrl="/auth" forceRedirectUrl="/account" fallbackRedirectUrl="/account" signUpForceRedirectUrl="/account" signUpFallbackRedirectUrl="/account" appearance={clerkAppearance} />
        ) : (
          <SignUp signInUrl="/auth" forceRedirectUrl="/account" fallbackRedirectUrl="/account" signInForceRedirectUrl="/account" signInFallbackRedirectUrl="/account" appearance={clerkAppearance} />
        )}
      </div>
    </section>
  );
}
