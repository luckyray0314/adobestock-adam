import type { Metadata } from "next";
import { Inter } from "next/font/google";
import ToastProvider from "@/components/Contexts/ToastContext";
import { getServerSession } from "next-auth";
import AuthProvider from "@/utils/SessionProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Microstock Keywording Tool",
  description: "Keyworder is a free keywording tool for microstock photographers.",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <AuthProvider session={session}>
            {children}
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
