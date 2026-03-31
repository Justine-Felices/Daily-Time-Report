"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Clock4,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  User,
} from "lucide-react";
import {
  BTN_PRIMARY,
  BTN_SECONDARY,
  GLASS,
} from "@/components/features/login/constants/styles";
import useLocalAuth from "@/components/features/login/hooks/useLocalAuth";
import InputField from "@/components/features/login/components/InputField";
import FieldError from "@/components/features/login/components/FieldError";
import FieldLabel from "@/components/features/login/components/FieldLabel";
import PasswordStrength from "@/components/features/login/components/PasswordStrength";
import Spinner from "@/components/features/login/components/Spinner";

const MODES = ["login", "signup"];

function validateForm(mode, values) {
  const errors = {};

  if (mode === "signup" && !values.name.trim()) {
    errors.name = "Full name is required.";
  }

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

export default function LoginContent() {
  const router = useRouter();
  const { login } = useLocalAuth();

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agree, setAgree] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setErrors({});
    setSuccess(false);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setAgree(false);
    setShowPassword(false);
    setShowConfirm(false);
  };

  const submit = () => {
    const nextErrors = validateForm(mode, {
      name,
      email,
      password,
      confirmPassword,
      agree,
    });

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);

      setTimeout(() => {
        login(email, mode === "signup" ? name : email.split("@")[0]);
        router.push("/");
      }, 900);
    }, 1200);
  };

  const EyeButton = ({ show, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: 0,
        display: "flex",
        color: "rgba(6,148,148,0.6)",
      }}
    >
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

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
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-140px",
            right: "-120px",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background: "rgba(255,105,180,0.13)",
            filter: "blur(90px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "480px",
            height: "480px",
            borderRadius: "50%",
            background: "rgba(6,148,148,0.10)",
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "40%",
            left: "35%",
            width: "340px",
            height: "340px",
            borderRadius: "50%",
            background: "rgba(0,240,255,0.07)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "5%",
            width: "220px",
            height: "220px",
            borderRadius: "50%",
            background: "rgba(255,105,180,0.07)",
            filter: "blur(60px)",
          }}
        />
      </div>

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
        <div className="mb-7 flex flex-col items-center">
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background:
                "linear-gradient(135deg, #046060 0%, #069494 55%, #FF69B4 100%)",
              boxShadow: "0 6px 20px rgba(6,148,148,0.40)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "14px",
            }}
          >
            <Clock4 size={24} color="#fff" />
          </div>
          <div
            style={{
              color: "#1E293B",
              fontSize: "22px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            TimeTrack
          </div>
          <div
            style={{
              color: "#069494",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.12em",
              marginTop: "2px",
            }}
          >
            DAILY TIME REPORT
          </div>
        </div>

        <div
          style={{
            display: "flex",
            background: "rgba(240,253,253,0.65)",
            border: "1.5px solid rgba(6,148,148,0.14)",
            borderRadius: "14px",
            padding: "4px",
            marginBottom: "28px",
          }}
        >
          {MODES.map((value) => (
            <button
              key={value}
              onClick={() => switchMode(value)}
              style={{
                flex: 1,
                padding: "9px 0",
                borderRadius: "10px",
                border: "none",
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: mode === value ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.2s",
                background:
                  mode === value
                    ? "linear-gradient(135deg, #069494 0%, #0aacac 100%)"
                    : "transparent",
                color: mode === value ? "#fff" : "#64748B",
                boxShadow:
                  mode === value ? "0 3px 10px rgba(6,148,148,0.30)" : "none",
              }}
            >
              {value === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: "22px" }}>
          <div
            style={{
              color: "#1E293B",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            {mode === "login" ? "Welcome back 👋" : "Create your account ✨"}
          </div>
          <div style={{ color: "#64748B", fontSize: "13px", marginTop: "4px" }}>
            {mode === "login"
              ? "Log in to continue tracking your OJT attendance."
              : "Set up your TimeTrack account in seconds."}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {mode === "signup" && (
            <div>
              <FieldLabel label="Full Name" />
              <InputField
                icon={User}
                placeholder="e.g. Alex Rivera"
                value={name}
                onChange={setName}
                error={Boolean(errors.name)}
              />
              {errors.name && <FieldError msg={errors.name} />}
            </div>
          )}

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
            <div>
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <div
                  onClick={() => setAgree((value) => !value)}
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "6px",
                    flexShrink: 0,
                    marginTop: "1px",
                    border: `1.5px solid ${agree ? "rgba(6,148,148,0.7)" : errors.agree ? "rgba(255,105,180,0.6)" : "rgba(6,148,148,0.3)"}`,
                    background: agree
                      ? "linear-gradient(135deg,#069494,#0aacac)"
                      : "rgba(240,253,253,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.15s",
                    boxShadow: agree ? "0 2px 8px rgba(6,148,148,0.3)" : "none",
                  }}
                >
                  {agree && (
                    <CheckCircle2 size={11} color="#fff" strokeWidth={2.5} />
                  )}
                </div>
                <span
                  style={{
                    color: "#475569",
                    fontSize: "12px",
                    fontFamily: "'Inter',sans-serif",
                    lineHeight: 1.5,
                  }}
                >
                  I agree to the{" "}
                  <span
                    style={{
                      color: "#069494",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Terms of Service
                  </span>{" "}
                  and{" "}
                  <span
                    style={{
                      color: "#FF69B4",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Privacy Policy
                  </span>
                </span>
              </label>
              {errors.agree && <FieldError msg={errors.agree} />}
            </div>
          )}
        </div>

        <div
          style={{
            marginTop: "22px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <button
            onClick={submit}
            disabled={submitting || success}
            style={{
              ...BTN_PRIMARY,
              opacity: submitting ? 0.85 : 1,
              background: success
                ? "linear-gradient(135deg,#22C55E,#16A34A)"
                : BTN_PRIMARY.background,
              boxShadow: success
                ? "0 4px 16px rgba(34,197,94,0.38)"
                : "0 4px 16px rgba(6,148,148,0.38)",
            }}
            onMouseEnter={(event) => {
              if (!submitting && !success) {
                event.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {success ? (
              <>
                <CheckCircle2 size={16} />{" "}
                {mode === "login" ? "Signing in..." : "Account created!"}
              </>
            ) : submitting ? (
              <>
                <Spinner />{" "}
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </>
            ) : mode === "login" ? (
              <>
                Log In <ArrowRight size={15} />
              </>
            ) : (
              <>
                Create Account <Sparkles size={14} />
              </>
            )}
          </button>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              margin: "2px 0",
            }}
          >
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(6,148,148,0.12)",
              }}
            />
            <span
              style={{
                color: "#94A3B8",
                fontSize: "11px",
                fontFamily: "'Inter',sans-serif",
                fontWeight: 500,
              }}
            >
              or
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background: "rgba(6,148,148,0.12)",
              }}
            />
          </div>

          <button
            onClick={() => {
              login("guest@timetrack.app", "Guest User");
              router.push("/");
            }}
            style={BTN_SECONDARY}
            onMouseEnter={(event) => {
              event.currentTarget.style.background = "rgba(6,148,148,0.08)";
              event.currentTarget.style.borderColor = "rgba(6,148,148,0.45)";
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.background = "rgba(240,253,253,0.60)";
              event.currentTarget.style.borderColor = "rgba(6,148,148,0.30)";
            }}
          >
            Continue as Guest
          </button>
        </div>

        <div
          style={{
            marginTop: "22px",
            textAlign: "center",
            fontSize: "13px",
            color: "#64748B",
            fontFamily: "'Inter',sans-serif",
          }}
        >
          {mode === "login" ? (
            <>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => switchMode("signup")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#069494",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Inter',sans-serif",
                  fontSize: "13px",
                  padding: 0,
                }}
              >
                Sign up free
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => switchMode("login")}
                style={{
                  background: "none",
                  border: "none",
                  color: "#069494",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "'Inter',sans-serif",
                  fontSize: "13px",
                  padding: 0,
                }}
              >
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
