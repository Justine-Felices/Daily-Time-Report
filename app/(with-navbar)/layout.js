import ClientOnlyNavbar from "@/components/layout/ClientOnlyNavbar";

export default function WithNavbarLayout({ children }) {
  return (
    <>
      <ClientOnlyNavbar />
      {children}
    </>
  );
}
