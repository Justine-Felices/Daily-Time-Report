import { Clock, FileText, History, PenLine, Target } from "lucide-react";

export const LANDING_FEATURES = [
  {
    icon: Clock,
    title: "Live Clock In & Out",
    description:
      "Track AM, PM, and overtime sessions in real time with a live clock and progress toward your daily target.",
  },
  {
    icon: PenLine,
    title: "Encode Past Days",
    description:
      "Missed a day? Add or bulk-add historical attendance records so your log stays complete.",
  },
  {
    icon: History,
    title: "Activity Logs",
    description:
      "Search, filter, and sort your full attendance history. Edit or remove entries anytime.",
  },
  {
    icon: FileText,
    title: "CS Form 48 Export",
    description:
      "Print official Daily Time Record forms or export your logs as PDF — ready for OJT submission.",
  },
  {
    icon: Target,
    title: "OJT Progress Tracking",
    description:
      "Set your target hours and watch your internship progress update automatically as you log time.",
  },
];

export const LANDING_STEPS = [
  {
    step: 1,
    title: "Create your account",
    description: "Sign up free with your email. No credit card required.",
  },
  {
    step: 2,
    title: "Complete your profile",
    description:
      "Add your name, company, supervisor, and OJT schedule so your records are ready to export.",
  },
  {
    step: 3,
    title: "Track & export",
    description:
      "Clock in daily, encode past entries, and generate your official DTR whenever you need it.",
  },
];

export const LANDING_COPY = {
  heroHeadline: "Track your OJT hours with confidence",
  heroSubheadline:
    "Manage clock-ins, encode past days, and export official DTR forms — built for interns and OJT students.",
  heroPrimaryCta: "Get Started Free",
  heroSecondaryCta: "Log in",
  featuresTitle: "Everything you need for your internship",
  featuresSubtitle:
    "From daily attendance to official form exports — all in one place.",
  howItWorksTitle: "How it works",
  howItWorksSubtitle: "Get started in three simple steps.",
  ctaTitle: "Ready to track your OJT hours?",
  ctaSubtitle:
    "Join JustIn Time Report and keep your daily time record organized from day one.",
  ctaPrimary: "Create free account",
  ctaSecondary: "Log in",
};
