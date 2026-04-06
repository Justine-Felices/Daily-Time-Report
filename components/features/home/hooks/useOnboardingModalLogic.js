import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { saveUserOnboardingProfile } from "@/lib/supabase-user-profiles";

const FIELD_ERROR_MAP = {
  full_name: "Full name is required.",
  target_hours: "Target hours is required.",
};

function normalizeInitialValues(initialValues) {
  return {
    full_name: initialValues?.full_name || "",
    department: initialValues?.department || "",
    position: initialValues?.position || "",
    supervisor: initialValues?.supervisor || "",
    company: initialValues?.company || "",
    start_date: initialValues?.start_date || "",
    end_date: initialValues?.end_date || "",
    target_hours:
      initialValues?.target_hours === null ||
      typeof initialValues?.target_hours === "undefined"
        ? ""
        : String(initialValues.target_hours),
  };
}

export default function useOnboardingModalLogic({
  isOpen,
  supabase,
  userId,
  initialValues,
  onComplete,
  onCancel,
  allowCancel,
  modalRef,
  trapFocus = true,
}) {
  const router = useRouter();
  const [values, setValues] = useState(() =>
    normalizeInitialValues(initialValues),
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    Promise.resolve().then(() => {
      setValues(normalizeInitialValues(initialValues));
      setErrors({});
      setFormError("");
    });
  }, [isOpen, initialValues]);

  useEffect(() => {
    if (!trapFocus || !isOpen || !modalRef.current) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusables = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusables.length > 0) {
      focusables[0].focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && allowCancel && !isSubmitting) {
        onCancel?.();
        return;
      }

      if (event.key !== "Tab") return;

      const tabbableElements = Array.from(
        modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => !element.hasAttribute("disabled"));

      if (tabbableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = tabbableElements[0];
      const lastElement = tabbableElements[tabbableElements.length - 1];
      const isShiftTab = event.shiftKey;
      const activeElement = document.activeElement;

      if (!isShiftTab && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      } else if (isShiftTab && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [allowCancel, isOpen, isSubmitting, modalRef, onCancel, trapFocus]);

  const requiredMissing =
    !values.full_name.trim() ||
    !values.target_hours ||
    Number(values.target_hours) <= 0;

  const validate = () => {
    const nextErrors = {};

    if (!values.full_name.trim()) {
      nextErrors.full_name = FIELD_ERROR_MAP.full_name;
    }

    if (!values.target_hours || Number(values.target_hours) <= 0) {
      nextErrors.target_hours = FIELD_ERROR_MAP.target_hours;
    }

    if (
      values.start_date &&
      values.end_date &&
      new Date(values.end_date) < new Date(values.start_date)
    ) {
      nextErrors.end_date = "End date must be on or after start date.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFieldChange = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (!errors[key]) return;

    setErrors((current) => ({ ...current, [key]: "" }));
  };

  const handleSubmit = async () => {
    setFormError("");

    if (!validate()) {
      return;
    }

    if (!supabase || !userId) {
      setFormError(
        "Unable to save profile right now. Please check your connection and try again.",
      );
      return;
    }

    setIsSubmitting(true);

    const { data, error } = await saveUserOnboardingProfile({
      supabase,
      userId,
      values,
    });

    setIsSubmitting(false);

    if (error) {
      setFormError(error.message || "Failed to save your profile details.");
      return;
    }

    onComplete?.(data);
    router.replace("/");
  };

  return {
    values,
    errors,
    formError,
    isSubmitting,
    requiredMissing,
    handleFieldChange,
    handleSubmit,
  };
}
