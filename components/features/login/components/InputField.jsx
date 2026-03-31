import { useState } from "react";
import {
  GLASS_INPUT,
  GLASS_INPUT_FOCUS,
} from "@/components/features/login/constants/styles";

export default function InputField({
  icon: Icon,
  placeholder,
  type = "text",
  value,
  onChange,
  right,
  error,
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <Icon
        size={16}
        color={error ? "#CC2277" : focused ? "#069494" : "rgba(6,148,148,0.5)"}
        style={{
          position: "absolute",
          left: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          pointerEvents: "none",
          transition: "color 0.18s",
        }}
      />

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...GLASS_INPUT,
          ...(focused ? GLASS_INPUT_FOCUS : {}),
          ...(right ? { paddingRight: "42px" } : {}),
          ...(error
            ? {
                borderColor: "rgba(255,105,180,0.6)",
                boxShadow: "0 0 0 3px rgba(255,105,180,0.10)",
              }
            : {}),
        }}
      />

      {right && (
        <div
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          {right}
        </div>
      )}
    </div>
  );
}
