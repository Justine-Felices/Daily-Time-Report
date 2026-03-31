import Navbar from "@/components/layout/Navbar";

export default function WithNavbarLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
