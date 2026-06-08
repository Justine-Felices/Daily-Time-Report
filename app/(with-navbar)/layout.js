import ClientOnlyNavbar from "@/components/layout/ClientOnlyNavbar";
import OjtEndDateReminder from "@/components/features/profile/OjtEndDateReminder";

export default function WithNavbarLayout({ children }) {
  return (
    <>
      <ClientOnlyNavbar />
      <OjtEndDateReminder />
      {children}
    </>
  );
}
