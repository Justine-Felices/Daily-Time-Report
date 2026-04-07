"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail } from "lucide-react";
import { GLASS } from "@/components/features/login/constants/styles";
import useLocalAuth from "@/components/features/login/hooks/useLocalAuth";
import InputField from "@/components/features/login/components/InputField";
import FieldError from "@/components/features/login/components/FieldError";
import FieldLabel from "@/components/features/login/components/FieldLabel";
import PasswordStrength from "@/components/features/login/components/PasswordStrength";
import EyeButton from "@/components/features/login/components/EyeButton";
import LoginDecorBackground from "@/components/features/login/components/LoginDecorBackground";
import LoginBrandHeader from "@/components/features/login/components/LoginBrandHeader";
import SignupAgreement from "@/components/features/login/components/SignupAgreement";
import AuthSubmitSection from "@/components/features/login/components/AuthSubmitSection";
import AuthModeSwitch from "@/components/features/login/components/AuthModeSwitch";
import validateAuthForm from "@/components/features/login/utils/validateAuthForm";

export default function LoginContent() {
  const router = useRouter();
  const { login, signup } = useLocalAuth();

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [infoMessage, setInfoMessage] = useState("");

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setSuccess(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAgree(false);
    setShowPassword(false);
    setShowConfirm(false);
    setInfoMessage("");
  };

  const submit = async () => {
    const nextErrors = validateAuthForm(mode, {
      email,
      password,
      confirmPassword,
      agree,
    });

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setInfoMessage("");
    setSubmitting(true);

    if (mode === "login") {
      const result = await login(email, password);
      setSubmitting(false);

      if (result.error) {
        setErrors((current) => ({ ...current, form: result.error }));
        return;
      }

      setSuccess(true);
      router.push("/");
      return;
    }

    const result = await signup(email, password, "");
    setSubmitting(false);

    if (result.error) {
      setErrors((current) => ({ ...current, form: result.error }));
      return;
    }

    setSuccess(true);

    if (result.needsEmailConfirmation) {
      setInfoMessage(
        "Check your email to confirm your account before signing in.",
      );
      return;
    }

    router.push("/");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <LoginDecorBackground />

      <div
        style={{
          ...GLASS,
          width: "100%",
          maxWidth: "440px",
          padding: "36px 36px 32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <LoginBrandHeader mode={mode} />

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <FieldLabel label="Email Address" />
            <InputField
              icon={Mail}
              placeholder="you@example.com"
              type="email"
              value={email}
              onChange={setEmail}
              error={Boolean(errors.email)}
            />
            {errors.email && <FieldError msg={errors.email} />}
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <FieldLabel label="Password" noMargin />
              {mode === "login" && (
                <button
                  type="button"
                  style={{
                    background: "none",
                    border: "none",
                    color: "#069494",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Inter',sans-serif",
                    padding: 0,
                  }}
                >
                  Forgot password?
                </button>
              )}
            </div>
            <InputField
              icon={Lock}
              placeholder={
                mode === "signup"
                  ? "At least 8 characters"
                  : "Enter your password"
              }
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={setPassword}
              error={Boolean(errors.password)}
              right={
                <EyeButton
                  show={showPassword}
                  onToggle={() => setShowPassword((value) => !value)}
                />
              }
            />
            {errors.password && <FieldError msg={errors.password} />}
          </div>

          {mode === "signup" && (
            <div>
              <FieldLabel label="Confirm Password" />
              <InputField
                icon={Lock}
                placeholder="Re-enter your password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={setConfirmPassword}
                error={Boolean(errors.confirmPassword)}
                right={
                  <EyeButton
                    show={showConfirm}
                    onToggle={() => setShowConfirm((value) => !value)}
                  />
                }
              />
              {errors.confirmPassword && (
                <FieldError msg={errors.confirmPassword} />
              )}
              {password.length > 0 && <PasswordStrength password={password} />}
            </div>
          )}

          {mode === "signup" && (
            <SignupAgreement
              agree={agree}
              error={errors.agree}
              onToggle={() => setAgree((value) => !value)}
            />
          )}
        </div>

        <AuthSubmitSection
          submit={submit}
          submitting={submitting}
          success={success}
          mode={mode}
          formError={errors.form}
          infoMessage={infoMessage}
        />

        <AuthModeSwitch mode={mode} switchMode={switchMode} />
      </div>
    </div>
  );
}
