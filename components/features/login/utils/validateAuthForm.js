export default function validateAuthForm(mode, values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Enter a valid email.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (mode === "signup" && values.password.length < 8) {
    errors.password = "At least 8 characters.";
  }

  if (mode === "signup") {
    if (!values.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!values.agree) {
      errors.agree = "You must agree to the terms.";
    }
  }

  return errors;
}
