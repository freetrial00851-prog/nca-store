export function sanitizeAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid email or password")
  ) {
    return "Incorrect email or password.";
  }

  if (lower.includes("email not confirmed")) {
    return "Your email is not confirmed yet. Please check your inbox.";
  }

  if (lower.includes("user already registered") || lower.includes("already been registered")) {
    return "An account with this email already exists. Try signing in instead.";
  }

  if (lower.includes("password should be at least")) {
    return "Password must be at least 6 characters.";
  }

  if (lower.includes("invalid email")) {
    return "Please enter a valid email address.";
  }

  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  if (lower.includes("network") || lower.includes("fetch")) {
    return "Something went wrong. Please check your connection and try again.";
  }

  if (lower.includes("token") && (lower.includes("expired") || lower.includes("invalid"))) {
    return "This link has expired or is invalid. Please request a new one.";
  }

  if (lower.includes("signup") && lower.includes("disabled")) {
    return "Account creation is temporarily unavailable. Please try again later.";
  }

  return "Unable to complete this action. Please try again.";
}

export function sanitizeLoginError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login credentials")) {
    return "Incorrect email or password.";
  }
  if (lower.includes("email not confirmed")) {
    return "Your email is not confirmed yet. Please check your inbox.";
  }
  return sanitizeAuthError(message);
}
