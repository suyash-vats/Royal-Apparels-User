import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider, useAuth, useClerk } from "@clerk/react";
import App from "./App";
import { StoreProvider } from "./store";
import { clerkAppearance, clerkEnabled, clerkPublishableKey } from "./clerk";
import "./index.css";

function ClerkStoreBridge() {
  const auth = useAuth();
  const { signOut } = useClerk();

  return (
    <StoreProvider
      auth={{
        configured: true,
        isLoaded: auth.isLoaded,
        isSignedIn: auth.isSignedIn,
        getToken: auth.getToken,
        signOut
      }}
    >
      <App />
    </StoreProvider>
  );
}

const app = clerkEnabled ? (
  <React.StrictMode>
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      appearance={clerkAppearance}
      afterSignOutUrl="/"
    >
      <BrowserRouter>
        <ClerkStoreBridge />
      </BrowserRouter>
    </ClerkProvider>
  </React.StrictMode>
) : (
  <React.StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <App />
      </StoreProvider>
    </BrowserRouter>
  </React.StrictMode>
);

if (!clerkEnabled) {
  console.warn(
    "[Royal Apparels] Clerk is not configured. Add VITE_CLERK_PUBLISHABLE_KEY in client/.env to enable sign-in."
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(app);
