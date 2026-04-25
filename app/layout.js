import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
import { cookies } from "next/headers";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

export const metadata = {
  title: "Daily Time Record",
  description: "Manage your internship hours with ease.",
};

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("dtr-theme-mode")?.value;
  const initialTheme =
    themeCookie === "light" || themeCookie === "dark" || themeCookie === "system"
      ? themeCookie
      : "system";
  const htmlThemeClass = initialTheme === "dark" ? "dark" : "";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} h-full antialiased ${htmlThemeClass}`.trim()}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
      </body>
    </html>
  );
}
