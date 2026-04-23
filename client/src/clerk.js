export const clerkPublishableKey =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";

export const clerkEnabled =
  Boolean(clerkPublishableKey) && !clerkPublishableKey.includes("replace_me");

export const clerkAppearance = {
  elements: {
    rootBox: "clerk-root",
    card: "clerk-card",
    headerTitle: "clerk-header-title",
    headerSubtitle: "clerk-header-subtitle",
    socialButtonsBlockButton: "clerk-social-button",
    formButtonPrimary: "clerk-primary-button",
    formFieldInput: "clerk-input",
    formFieldLabel: "clerk-field-label",
    footerActionLink: "clerk-footer-link",
    dividerLine: "clerk-divider-line",
    dividerText: "clerk-divider-text",
    identityPreviewText: "clerk-identity-preview",
    footer: "clerk-footer"
  },
  variables: {
    colorPrimary: "#0f2747",
    colorText: "#10233f",
    colorTextSecondary: "#5b7290",
    colorBackground: "#ffffff",
    colorInputBackground: "rgba(255, 255, 255, 0.94)",
    colorInputText: "#10233f",
    borderRadius: "8px"
  }
};
