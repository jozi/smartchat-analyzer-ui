import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "سیستم تشخیص گفتگوی تجاری باسلام",
  description: "تشخیص هوشمند سفارش‌های عمده، صادراتی، خروج از پلتفرم و مذاکره قیمت",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}