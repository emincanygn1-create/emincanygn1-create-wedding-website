import type { Metadata } from "next";
import { Fraunces, Jost, Great_Vibes } from "next/font/google";
import { headers, cookies } from "next/headers";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  title: "İsim & İsim | Düğünümüz",
  description: "Düğünümüze davetlisiniz.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const cookieStore = await cookies();

  const fromHeader = headerList.get("x-locale");
  const fromCookie = cookieStore.get("NEXT_LOCALE")?.value;

  const lang = isLocale(fromHeader)
    ? fromHeader
    : isLocale(fromCookie)
      ? fromCookie
      : defaultLocale;

  return (
    <html lang={lang}>
      <body className={`${fraunces.variable} ${jost.variable} ${greatVibes.variable} font-body`}>
        {children}
      </body>
    </html>
  );
}
