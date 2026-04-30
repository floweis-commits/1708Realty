import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "1708 Realty",
  description: "Property management portal",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
