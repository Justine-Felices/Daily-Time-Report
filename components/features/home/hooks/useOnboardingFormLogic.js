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

export default function useOnboardingFormLogic({
  supabase,
  userId,
  initialValues,
  onComplete,
}) {
  const router = useRouter();
  const [values, setValues] = useState(() =>
    normalizeInitialValues(initialValues),
  );
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => {
      setValues(normalizeInitialValues(initialValues));
      setErrors({});
      setFormError("");
    });
  }, [initialValues]);

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
    router.replace("/dashboard");
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
