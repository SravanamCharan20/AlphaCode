export const authPageContent = {
  signin: {
    title: "Sign in",
    subtitle: "Access your account",
    cta: "Sign in",
    switchLabel: "Need an account?",
    switchCta: "Create one",
    switchHref: "/auth/signup",
  },
  signup: {
    title: "Create account",
    subtitle: "Get started with AlphaCode",
    cta: "Create account",
    switchLabel: "Already have an account?",
    switchCta: "Sign in",
    switchHref: "/auth/signin",
  },
} as const;
